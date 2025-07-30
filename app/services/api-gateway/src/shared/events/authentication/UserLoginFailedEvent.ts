import { IUserContextEvent } from '../IUserContextEvent'; // Importamos la interfaz base con userId opcional

export interface UserLoginFailedPayload {
  email: string; // El correo electrónico del intento de login fallido
  reason: string; // Razón del fallo (ej. 'INVALID_CREDENTIALS', 'USER_NOT_FOUND_OR_INACTIVE', 'DATABASE_ERROR', 'PASSWORD_HASHER_ERROR')
  // Opcional: Información adicional si es relevante para auditoría y no sensible
  // ipAddress?: string;
  // userAgent?: string;
  // No necesitamos userId en el payload si está directamente en la clase del evento (como en IUserContextEvent)
}

// Clase del evento de fallo de autenticación de usuario - Implementa IUserContextEvent
export class UserLoginFailedEvent implements IUserContextEvent {
  public readonly type = 'UserLoginFailedEvent';
  public readonly timestamp: Date;
  public readonly userId?: string; // userId es opcional en este evento (si se pudo identificar al usuario)
  public readonly payload: UserLoginFailedPayload;

  constructor(payload: UserLoginFailedPayload, userId?: string) {
    this.timestamp = new Date();
    this.payload = payload;
    this.userId = userId; // Asignamos el ID del usuario si se proporciona (si se pudo identificar por email)
  }
}
