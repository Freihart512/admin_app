import { IUserContextEvent } from '../IUserContextEvent'; // Importamos la nueva interfaz
    import { User } from '../../../../domain/entities/User';

    export interface UserLoggedInPayload {
      email: string;
      roles: string[];
      // No necesitamos userId en el payload si está directamente en la clase del evento
    }

    export class UserLoggedInEvent implements IUserContextEvent { // Implementa IUserContextEvent
      public readonly type = 'UserLoggedInEvent';
      public readonly timestamp: Date;
      public readonly userId: string; // Añadimos userId directamente a la clase del evento
      public readonly payload: UserLoggedInPayload;

      constructor(user: User) {
        this.timestamp = new Date();
        this.userId = user.id; // Asignamos el ID del usuario
        this.payload = {
          email: user.email,
          roles: user.roles,
        };
      }
    }
