import { Pool } from 'pg';
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository';
import { IDomainEvent } from '../../../shared/events/IDomainEvent';
import { IUserContextEvent } from '../../../shared/events/IUserContextEvent';
import { DatabaseError } from '../../errors/DatabaseError';

export class PostgresAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly pool: Pool) {}

  async saveEvent(event: IDomainEvent): Promise<void> {
    const query = `
      INSERT INTO audit_logs (id, timestamp, event_type, user_id, payload)
      VALUES (gen_random_uuid(), $1, $2, $3, $4::jsonb)
    `;

    const userId = this.extractUserId(event);
    const values = [
      event.timestamp,
      event.type,
      userId,
      event.payload,
    ];

    try {
      await this.pool.query(query, values);
    } catch (error: unknown) {
      const dbError = error as any;
      throw new DatabaseError(
        `Failed to save audit log for event ${event.type}: ${dbError.message}`,
        {
          type: 'INSERT_ERROR',
          dbErrorCode: dbError.code,
          details: { table: 'audit_logs', operation: 'INSERT' },
          originalError: dbError,
        }
      );
    }
  }

  /**
   * Extrae el userId si el evento implementa IUserContextEvent.
   */
  private extractUserId(event: IDomainEvent): string | null {
    if ('userId' in event && typeof (event as IUserContextEvent).userId === 'string') {
      return (event as IUserContextEvent).userId || null;
    }
    return null;
  }
}
