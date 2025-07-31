import { Pool } from 'pg';
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository'; // Importamos la interfaz del repositorio de dominio
import { IDomainEvent } from '../../../shared/events/IDomainEvent'; // Importamos la interfaz base de eventos
import { IUserContextEvent } from '../../../shared/events/IUserContextEvent'; // Importamos la interfaz de eventos con contexto de usuario
import { DatabaseError } from '../errors/DatabaseError'; // Importamos el error de infraestructura de DB

export class PostgresAuditLogRepository implements IAuditLogRepository {
  constructor(
    private pool: Pool // Inyectamos el pool de conexiones
  ) {}

  /**
   * Guarda un evento de dominio en la tabla de logs de auditoría.
   * @param event El evento de dominio a guardar.
   */
  async saveEvent(event: IDomainEvent): Promise<void> {
    
    try {
      const query = `
        INSERT INTO audit_logs (id, timestamp, event_type, user_id, payload)
        VALUES (gen_random_uuid(), $1, $2, $3, $4::jsonb)
      `;

      // Intentar obtener el user_id si el evento implementa IUserContextEvent
      const userContextEvent = event as IUserContextEvent;
      const userId = userContextEvent.userId; // Será string o undefined/null si no implementa IUserContextEvent o userId es opcional y no está presente

      const values = [
        event.timestamp,
        event.type,
        userId, // Puede ser null si el evento no tiene un userId asociado
        event.payload, // El payload del evento (será almacenado como JSONB)
      ];

      await this.pool.query(query, values);
      
    } catch (error: any) {
      console.error(`Error saving audit log for event ${event.type}:`, error);
      // Envolvemos cualquier error de base de datos en un DatabaseError
      throw new DatabaseError(
        `Failed to save audit log for event ${event.type}: ${error.message}`,
        {
          type: 'INSERT_ERROR',
          dbErrorCode: error.code,
          details: { table: 'audit_logs', operation: 'INSERT' },
          originalError: error,
        }
      );
    }
  }

  // Podrías añadir implementaciones para los métodos de consulta si los definiste en IAuditLogRepository
  // async findLogsByUserId(userId: string): Promise<AuditLogEntry[]> { ... }
}
