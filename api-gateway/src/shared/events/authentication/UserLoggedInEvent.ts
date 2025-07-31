import { IUserContextEvent } from '../IUserContextEvent';
import { User } from '../../../domain/entities/User';

export interface UserLoggedInPayload {
  email: string;
  roles: string[];
}

export class UserLoggedInEvent
  implements IUserContextEvent<'UserLoggedInEvent', UserLoggedInPayload>
{
  public readonly type = 'UserLoggedInEvent';

  public readonly timestamp: Date;

  // userId es requerido en este caso (después de encontrar al usuario), definido en IUserContextEvent
  public readonly userId: string;

  // El payload, tipado con la interfaz específica, definido en IUserContextEvent (a través de IDomainEvent)
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
