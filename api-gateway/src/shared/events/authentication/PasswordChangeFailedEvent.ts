import { IDomainEvent } from '../IDomainEvent';

export interface PasswordChangeFailedPayload {
  userId?: string; // El ID del usuario (si está logueado)
  reason: string; // Razón del fallo (ej. 'INCORRECT_CURRENT_PASSWORD', 'NEW_PASSWORD_VALIDATION_FAILED', 'DATABASE_ERROR')
  // Opcional: Información adicional
}

export class PasswordChangeFailedEvent implements IDomainEvent {
  public readonly type = 'PasswordChangeFailedEvent';
  public readonly timestamp: Date;
  public readonly payload: PasswordChangeFailedPayload;

  constructor(reason: string, options?: { userId?: string }) {
    this.timestamp = new Date();
    this.payload = {
      reason: reason,
      userId: options?.userId,
    };
  }
}
