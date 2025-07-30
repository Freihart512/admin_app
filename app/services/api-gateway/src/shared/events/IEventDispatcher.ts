import { IDomainEvent } from './IDomainEvent'; // Asegúrate de que la ruta a IDomainEvent sea correcta

// Interfaz para un Event Dispatcher
export interface IEventDispatcher {
  // Registra un manejador para un tipo de evento específico
  // T extiende IDomainEvent para tipar el manejador según el evento
  subscribe<T extends IDomainEvent>(eventType: string, handler: (event: T) => Promise<void> | void): void;

  // Desregistra un manejador para un tipo de evento específico
  // T extiende IDomainEvent para tipar el manejador según el evento
  unsubscribe<T extends IDomainEvent>(eventType: string, handler: (event: T) => Promise<void> | void): void;

  // Emite un evento, notificando a todos los manejadores suscritos a ese tipo de evento
  // T extiende IDomainEvent para aceptar cualquier evento que implemente la interfaz base
  dispatch<T extends IDomainEvent>(event: T): Promise<void>;
}
