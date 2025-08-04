// src/infrastructure/database/repositories/PostgresLoginSecurityRepository.ts
import { Pool } from 'pg';
import { ILoginSecurityRepository, LoginSecurity } from '../../../domain/security/ILoginSecurityRepository';
import { DatabaseError } from '../../errors/DatabaseError';

export class PostgresLoginSecurityRepository implements ILoginSecurityRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private mapRow(row: any): LoginSecurity {
    return {
      userId: row.user_id,
      failedAttempts: Number(row.failed_attempts),
      lockedUntil: row.locked_until ? new Date(row.locked_until) : null,
      lastFailedAt: row.last_failed_at ? new Date(row.last_failed_at) : null,
      lastSuccessAt: row.last_success_at ? new Date(row.last_success_at) : null,
      updatedAt: new Date(row.updated_at),
      createdAt: new Date(row.created_at),
    };
  }

  async getByUserId(userId: string): Promise<LoginSecurity | null> {
    try {
      const { rows } = await this.pool.query(
        `
          SELECT user_id, failed_attempts, locked_until, last_failed_at, last_success_at, updated_at, created_at
          FROM login_security
          WHERE user_id = $1
          LIMIT 1
        `,
        [userId]
      );
      if (rows.length === 0) return null;
      return this.mapRow(rows[0]);
    } catch (err: any) {
      throw new DatabaseError('Failed to fetch login security by userId', err);
    }
  }

  async upsertInitial(userId: string): Promise<LoginSecurity> {
    try {
      const { rows } = await this.pool.query(
        `
          INSERT INTO login_security (user_id, failed_attempts, locked_until, last_failed_at, last_success_at)
          VALUES ($1, 0, NULL, NULL, NULL)
          ON CONFLICT (user_id) DO UPDATE
            SET user_id = EXCLUDED.user_id
          RETURNING user_id, failed_attempts, locked_until, last_failed_at, last_success_at, updated_at, created_at
        `,
        [userId]
      );
      return this.mapRow(rows[0]);
    } catch (err: any) {
      throw new DatabaseError('Failed to upsert initial login security', err);
    }
  }

  async incrementFailedAttemptAndMaybeLock(
    userId: string,
    maxFailedAttempts: number,
    lockoutMinutes: number
  ): Promise<LoginSecurity> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Asegurar fila
      await client.query(
        `
          INSERT INTO login_security (user_id, failed_attempts)
          VALUES ($1, 0)
          ON CONFLICT (user_id) DO NOTHING
        `,
        [userId]
      );

      // Incrementar y decidir lock
      const { rows } = await client.query(
        `
          UPDATE login_security
          SET
            failed_attempts = failed_attempts + 1,
            last_failed_at = NOW(),
            locked_until = CASE
              WHEN failed_attempts + 1 >= $2
                THEN GREATEST(COALESCE(locked_until, NOW()), NOW()) + ($3 || ' minutes')::INTERVAL
              ELSE locked_until
            END,
            updated_at = NOW()
          WHERE user_id = $1
          RETURNING user_id, failed_attempts, locked_until, last_failed_at, last_success_at, updated_at, created_at
        `,
        [userId, maxFailedAttempts, String(lockoutMinutes)]
      );

      await client.query('COMMIT');
      return this.mapRow(rows[0]);
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw new DatabaseError('Failed to increment failed attempts and maybe lock', err);
    } finally {
      client.release();
    }
  }

  async resetOnSuccess(userId: string, at: Date): Promise<LoginSecurity> {
    try {
      const { rows } = await this.pool.query(
        `
          UPDATE login_security
          SET
            failed_attempts = 0,
            locked_until = NULL,
            last_success_at = $2,
            updated_at = NOW()
          WHERE user_id = $1
          RETURNING user_id, failed_attempts, locked_until, last_failed_at, last_success_at, updated_at, created_at
        `,
        [userId, at.toISOString()]
      );

      // Si no existe fila (poco común), la creamos y devolvemos ya reseteado
      if (rows.length === 0) {
        const { rows: rows2 } = await this.pool.query(
          `
            INSERT INTO login_security (user_id, failed_attempts, locked_until, last_failed_at, last_success_at)
            VALUES ($1, 0, NULL, NULL, $2)
            ON CONFLICT (user_id) DO UPDATE
              SET failed_attempts = 0,
                  locked_until = NULL,
                  last_success_at = EXCLUDED.last_success_at,
                  updated_at = NOW()
            RETURNING user_id, failed_attempts, locked_until, last_failed_at, last_success_at, updated_at, created_at
          `,
          [userId, at.toISOString()]
        );
        return this.mapRow(rows2[0]);
      }

      return this.mapRow(rows[0]);
    } catch (err: any) {
      throw new DatabaseError('Failed to reset login security on success', err);
    }
  }

  async isLocked(userId: string, now: Date): Promise<boolean> {
    try {
      const { rows } = await this.pool.query(
        `
          SELECT 1
          FROM login_security
          WHERE user_id = $1
            AND locked_until IS NOT NULL
            AND locked_until > $2::timestamptz
          LIMIT 1
        `,
        [userId, now.toISOString()]
      );
      return rows.length > 0;
    } catch (err: any) {
      throw new DatabaseError('Failed to check locked state', err);
    }
  }
}
