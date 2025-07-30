import { IDomainEvent } from '../../../shared/events/IDomainEvent'; // Importamos la interfaz base de eventos

// Interfaz para el Repositorio de Logs de Auditoría
export interface IAuditLogRepository {
  // Método para guardar un evento de dominio en el log de auditoría
  saveEvent(event: IDomainEvent): Promise<void>;

  // Podrías añadir otros métodos para consultar logs si es necesario
  // findLogsByUserId(userId: string): Promise<AuditLogEntry[]>;
  // findLogsByEventType(eventType: string): Promise<AuditLogEntry[]>;
  // etc.
}

// Opcional: Definir una interfaz para una entrada de log de auditoría si la necesitas para consultar
// export interface AuditLogEntry {
//   id: string; // ID del log
//   timestamp: Date;
//   eventType: string;
//   userId?: string; // Si el log está asociado a un usuario
//   payload: any; // Los datos del evento (JSONB en DB)
//   // Otros campos de contexto (ej. ip_address, user_agent)
// }
