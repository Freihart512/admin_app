import { IDomainEvent } from './IDomainEvent';

// Interfaz para eventos que ocurren en el contexto de un usuario
export interface IUserContextEvent extends IDomainEvent {
  // ID del usuario asociado al evento (opcional, ya que no todos los eventos tienen un usuario logueado)
  userId?: string;
}
