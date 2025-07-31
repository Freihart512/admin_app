import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { Pool, QueryResult } from 'pg';
import { UserNotFoundError } from '../../../domain/errors/user/UserNotFoundError';
import { EmailAlreadyExistsError } from '../../../domain/errors/user/EmailAlreadyExistsError';
import { RfcAlreadyExistsError } from '../../../domain/errors/user/RfcAlreadyExistsError';
// Importamos el error de infraestructura genérico para problemas de base de datos
import { DatabaseError } from '../../errors/DatabaseError';

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result: QueryResult = await this.pool.query(
        `SELECT
           id,
           email,
           name,
           last_name,
           phone_number,
           address,
           rfc,
           roles,
           password_hash,
           is_active
         FROM users
         WHERE email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new User(
        row.id,
        row.email,
        row.name,
        row.last_name,
        row.phone_number,
        row.address,
        row.rfc,
        row.roles,
        row.password_hash,
        row.is_active
      );
    } catch (error: any) {
      console.error(`Error finding user by email ${email}:`, error);
      // Si no es un error específico (como no encontrado, que findByEmail maneja devolviendo null),
      // lo envolvemos en un DatabaseError
      throw new DatabaseError(`Failed to query user by email: ${error.message}`, {
        type: 'QUERY_ERROR',
        dbErrorCode: error.code,
        details: { table: 'users', operation: 'SELECT' },
        originalError: error,
      });
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result: QueryResult = await this.pool.query(
        'SELECT id, email, name, last_name, phone_number, address, rfc, roles, password_hash, is_active FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new User(
        row.id,
        row.email,
        row.name,
        row.last_name,
        row.phone_number,
        row.address,
        row.rfc,
        row.roles,
        row.password_hash,
        row.is_active
      );
    } catch (error: any) {
      console.error(`Error finding user by id ${id}:`, error);
      throw new DatabaseError(`Failed to query user by id: ${error.message}`, {
        type: 'QUERY_ERROR',
        dbErrorCode: error.code,
        details: { table: 'users', operation: 'SELECT' },
        originalError: error,
      });
    }
  }

  async save(user: User): Promise<void> {
    try {
      const query = `
          INSERT INTO users (id, email, name, last_name, phone_number, address, rfc, roles, password_hash, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
      const values = [
        user.id,
        user.email,
        user.name,
        user.lastName,
        user.phoneNumber,
        user.address,
        user.rfc,
        user.roles,
        user.passwordHash,
        user.isActive,
      ];
      await this.pool.query(query, values);
    } catch (error: any) {
      console.error(`Error saving user ${user.email}:`, error);
      if (error.code === '23505') {
        // Violación de unicidad
        if (error.constraint === 'users_email_key') {
          throw new EmailAlreadyExistsError(user.email);
        }
        if (error.constraint && error.constraint.includes('users_rfc_')) {
          throw new RfcAlreadyExistsError(user.rfc || '');
        }
        if (error.constraint && error.constraint.includes('users_phone_number_')) {
          throw new Error(`Phone number already exists.`);
        }
      }
      // Si no es un error de unicidad específico, lo envolvemos en DatabaseError
      throw new DatabaseError(`Failed to save user: ${error.message}`, {
        type: 'INSERT_ERROR',
        dbErrorCode: error.code,
        details: { table: 'users', operation: 'INSERT' },
        originalError: error,
      });
    }
  }

  async update(user: User): Promise<void> {
    try {
      const query = `
           UPDATE users
           SET email = $1, name = $2, last_name = $3, phone_number = $4, address = $5, rfc = $6, roles = $7, is_active = $8
           WHERE id = $9
         `;
      const values = [
        user.email,
        user.name,
        user.lastName,
        user.phoneNumber,
        user.address,
        user.rfc,
        user.roles,
        user.isActive,
        user.id,
      ];
      const result = await this.pool.query(query, values);

      if (result.rowCount === 0) {
        throw new UserNotFoundError(`User with ID ${user.id} not found.`);
      }
    } catch (error: any) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      if (error.code === '23505') {
        if (error.constraint === 'users_email_key' && user.email) {
          throw new EmailAlreadyExistsError(user.email);
        }
        if (error.constraint && error.constraint.includes('users_rfc_') && user.rfc) {
          throw new RfcAlreadyExistsError(user.rfc);
        }
        if (
          error.constraint &&
          error.constraint.includes('users_phone_number_') &&
          user.phoneNumber
        ) {
          throw new Error(`Phone number already exists.`);
        }
      }
      // Si no es un error de unicidad específico o UserNotFoundError, lo envolvemos en DatabaseError
      throw new DatabaseError(`Failed to update user: ${error.message}`, {
        type: 'UPDATE_ERROR',
        dbErrorCode: error.code,
        details: { table: 'users', operation: 'UPDATE' },
        originalError: error,
      });
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      const query = `
           UPDATE users
           SET password_hash = $1
           WHERE id = $2
         `;
      const values = [hashedPassword, userId];
      const result = await this.pool.query(query, values);
      if (result.rowCount === 0) {
        throw new UserNotFoundError(`User with ID ${userId} not found.`);
      }
    } catch (error: any) {
      console.error(`Error updating password for user ${userId}:`, error);
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      // Si no es UserNotFoundError, lo envolvemos en DatabaseError
      throw new DatabaseError(`Failed to update password for user ${userId}: ${error.message}`, {
        type: 'UPDATE_ERROR',
        dbErrorCode: error.code,
        details: { table: 'users', operation: 'UPDATE', field: 'password_hash' },
        originalError: error,
      });
    }
  }

  async savePasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    try {
      const query = `
          INSERT INTO password_reset_tokens (user_id, token, expires_at)
          VALUES ($1, $2, $3)
        `;
      const values = [userId, token, expiresAt];
      await this.pool.query(query, values);
    } catch (error: any) {
      console.error(`Error saving password reset token for user ${userId}:`, error);
      // Si no es un error de unicidad específico (ej. en la tabla de tokens), lo envolvemos
      throw new DatabaseError(
        `Failed to save password reset token for user ${userId}: ${error.message}`,
        {
          type: 'INSERT_ERROR',
          dbErrorCode: error.code,
          details: { table: 'password_reset_tokens', operation: 'INSERT' },
          originalError: error,
        }
      );
    }
  }

  async findPasswordResetToken(token: string): Promise<{ userId: string; expiresAt: Date } | null> {
    try {
      const result: QueryResult = await this.pool.query(
        'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used IS FALSE',
        [token]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return { userId: row.user_id, expiresAt: row.expires_at };
    } catch (error: any) {
      console.error(`Error finding password reset token ${token}:`, error);
      throw new DatabaseError(`Failed to find password reset token: ${error.message}`, {
        type: 'QUERY_ERROR',
        dbErrorCode: error.code,
        details: { table: 'password_reset_tokens', operation: 'SELECT' },
        originalError: error,
      });
    }
  }

  async invalidatePasswordResetToken(token: string): Promise<void> {
    try {
      const query = `
           UPDATE password_reset_tokens
           SET used = TRUE
           WHERE token = $1
         `;
      const values = [token];
      await this.pool.query(query, values);
    } catch (error: any) {
      console.error(`Error invalidating password reset token ${token}:`, error);
      throw new DatabaseError(`Failed to invalidate password reset token: ${error.message}`, {
        type: 'UPDATE_ERROR',
        dbErrorCode: error.code,
        details: { table: 'password_reset_tokens', operation: 'UPDATE', field: 'used' },
        originalError: error,
      });
    }
  }

  async updateStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      const query = `
           UPDATE users
           SET is_active = $1
           WHERE id = $2
         `;
      const values = [isActive, userId];
      const result = await this.pool.query(query, values);
      if (result.rowCount === 0) {
        throw new UserNotFoundError(`User with ID ${userId} not found.`);
      }
    } catch (error: any) {
      console.error(`Error updating status for user ${userId}:`, error);
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update status for user ${userId}: ${error.message}`, {
        type: 'UPDATE_ERROR',
        dbErrorCode: error.code,
        details: { table: 'users', operation: 'UPDATE', field: 'is_active' },
        originalError: error,
      });
    }
  }

  async updateRoles(userId: string, roles: string[]): Promise<void> {
    try {
      const query = `
           UPDATE users
           SET roles = $1
           WHERE id = $2
         `;
      const values = [roles, userId]; // Asumiendo que roles es un array JSON o similar en DB
      const result = await this.pool.query(query, values);
      if (result.rowCount === 0) {
        throw new UserNotFoundError(`User with ID ${userId} not found.`);
      }
    } catch (error: any) {
      console.error(`Error updating roles for user ${userId}:`, error);
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update roles for user ${userId}: ${error.message}`, {
        type: 'UPDATE_ERROR',
        dbErrorCode: error.code,
        details: { table: 'users', operation: 'UPDATE', field: 'roles' },
        originalError: error,
      });
    }
  }
}
