import { IDomainEvent } from '../IDomainEvent';

export interface PasswordResetFailedPayload {
  token?: string; // El token de la solicitud fallida (si está disponible y no sensible)
  userId?: string; // El ID del usuario (si se pudo determinar)
  reason: string; // Razón del fallo (ej. 'INVALID_TOKEN', 'EXPIRED_TOKEN', 'PASSWORD_VALIDATION_FAILED', 'DATABASE_ERROR')
  // Opcional: Información adicional
}

export class PasswordResetFailedEvent implements IDomainEvent {
  public readonly type = 'PasswordResetFailedEvent';
  public readonly timestamp: Date;
  public readonly payload: PasswordResetFailedPayload;

  constructor(reason: string, options?: { token?: string; userId?: string }) {
    this.timestamp = new Date();
    this.payload = {
      reason: reason,
      token: options?.token,
      userId: options?.userId,
    };
  }
}
