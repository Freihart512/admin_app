// app/services/api-gateway/src/shared/events/IUserContextEvent.ts
import { IDomainEvent } from './IDomainEvent';

export interface IUserContextEvent<TType extends string = string, TPayload = any> extends IDomainEvent<TType, TPayload> {
  // ID del usuario asociado al evento (opcional, ya que no todos los eventos tienen un usuario logueado)
  userId?: string;
}
