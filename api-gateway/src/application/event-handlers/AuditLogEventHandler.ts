import { IDomainEvent } from '../../shared/events/IDomainEvent';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';
import { AuditLogSaveError } from '../errors/audit/AuditLogSaveError';

export class AuditLogEventHandler {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  async handle(event: IDomainEvent): Promise<void> {
    try {
      await this.auditLogRepository.saveEvent(event);
    } catch (error: unknown) {
      // Aquí puedes lanzar un error tipado que no sea un bug, sino un error de negocio controlado
      throw new AuditLogSaveError('Failed to persist audit log event', {
        originalEvent: event,
        cause: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}