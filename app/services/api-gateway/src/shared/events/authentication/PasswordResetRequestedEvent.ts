import { IUserContextEvent } from '../IUserContextEvent'; // Importamos la nueva interfaz

    export interface PasswordResetRequestedPayload {
      email: string;
      // Token y expiración si son necesarios para el listener
      // token?: string;
      // expiresAt?: Date;
    }

    export class PasswordResetRequestedEvent implements IUserContextEvent { // Implementa IUserContextEvent
      public readonly type = 'PasswordResetRequestedEvent';
      public readonly timestamp: Date;
      public readonly userId: string; // userId es requerido en este caso (después de encontrar al usuario)
      public readonly payload: PasswordResetRequestedPayload;

      constructor(userId: string, email: string) {
        this.timestamp = new Date();
        this.userId = userId; // Asignamos el ID del usuario
        this.payload = {
          email: email,
        };
      }
    }
