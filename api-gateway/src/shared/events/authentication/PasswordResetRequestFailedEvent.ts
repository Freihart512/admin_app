import { IDomainEvent } from '../IDomainEvent';

export interface PasswordResetRequestFailedPayload {
  email: string; // El correo electrónico de la solicitud fallida
  reason: string; // Razón del fallo (ej. 'USER_NOT_FOUND_OR_INACTIVE_SIMULATED', 'DATABASE_ERROR', 'NOTIFICATION_ERROR')
  // Opcional: Información adicional
}

export class PasswordResetRequestFailedEvent implements IDomainEvent {
  public readonly type = 'PasswordResetRequestFailedEvent';
  public readonly timestamp: Date;
  public readonly payload: PasswordResetRequestFailedPayload;

  constructor(email: string, reason: string) {
    this.timestamp = new Date();
    this.payload = {
      email: email,
      reason: reason,
    };
  }
}
