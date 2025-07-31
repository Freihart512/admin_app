// app/services/api-gateway/src/infrastructure/event-dispatcher/InMemoryEventDispatcher.ts
import { IEventDispatcher } from '../../shared/events/IEventDispatcher';
import { IDomainEvent } from '../../shared/events/IDomainEvent';
// Importamos las interfaces desde shared

// Importa el nuevo evento de fallo
import { HandlerExecutionFailedEvent } from '../../shared/events/application/HandlerExecutionFailedEvent';

// Define un tipo para almacenar los manejadores de eventos por tipo de evento
type EventHandler<T extends IDomainEvent> = (event: T) => Promise<void> | void;
type EventHandlersMap = {
  [eventType: string]: EventHandler<IDomainEvent>[];
};

export class InMemoryEventDispatcher implements IEventDispatcher {
  // Un mapa para almacenar los manejadores de eventos suscritos, indexados por tipo de evento
  private handlers: EventHandlersMap = {};

  /**
   * Registra un manejador para un tipo de evento específico.
   * @param eventType El tipo de evento al que suscribirse.
   * @param handler La función manejadora que se ejecutará cuando se emita el evento.
   */
  subscribe<T extends IDomainEvent>(eventType: string, handler: EventHandler<T>): void {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    // Asegurarse de no suscribir el mismo handler múltiples veces para el mismo evento
    if (!this.handlers[eventType].includes(handler as EventHandler<IDomainEvent>)) {
      this.handlers[eventType].push(handler as EventHandler<IDomainEvent>);
    }
  }

  /**
   * Desregistra un manejador para un tipo de evento específico.
   * @param eventType El tipo de evento del que desuscribirse.
   * @param handler La función manejadora a desregistrar.
   */
  unsubscribe<T extends IDomainEvent>(eventType: string, handler: EventHandler<T>): void {
    if (this.handlers[eventType]) {
      this.handlers[eventType] = this.handlers[eventType].filter(
        (h) => h !== (handler as EventHandler<IDomainEvent>)
      );
      // Limpiar el array si queda vacío
      if (this.handlers[eventType].length === 0) {
        delete this.handlers[eventType];
      }
    }
  }

  /**
   * Emite un evento, notificando a todos los manejadores suscritos a ese tipo de evento.
   * Los manejadores se ejecutan de forma asíncrona sin esperar a que terminen (fuego y olvida).
   * @param event El evento a emitir.
   */
  async dispatch<T extends IDomainEvent>(event: T): Promise<void> {
    const handlers = this.handlers[event.type];

    if (handlers) {
      handlers.forEach((handler) => {
        Promise.resolve(handler(event)).catch((handlerError) => {
          console.error(`Error handling event ${event.type} by a handler:`, handlerError);

          // *** MODIFICACIÓN AQUÍ ***
          // Emitir el nuevo evento de fallo de ejecución de manejador
          const handlerFailedEvent = new HandlerExecutionFailedEvent({
            originalEventType: event.type,
            originalEventPayload: event.payload,
            // Puedes intentar obtener el nombre del manejador si es posible (puede ser complejo)
            // handlerName: handler.name || 'AnonymousHandler',
            error: {
              name: handlerError.name || 'UnknownError',
              message: handlerError.message || 'No message',
              stack: handlerError.stack,
            },
          });

          // Despacha el evento de fallo.
          // Es CRUCIAL que el manejador de HandlerExecutionFailedEvent NO emita eventos adicionales de error.
          this.dispatch(handlerFailedEvent).catch((dispatchError) => {
            // Si incluso el dispatch del HandlerExecutionFailedEvent falla, solo logueamos para evitar bucles
            console.error(
              'FATAL: Failed to dispatch HandlerExecutionFailedEvent from handler error:',
              dispatchError
            );
          });
          // *** FIN DE LA MODIFICACIÓN ***
        });
      });
    } else {
      console.warn(`No handlers subscribed for event type: ${event.type}`);
    }

    // Opcional: Si quieres esperar a que todos los manejadores terminen antes de que termine el dispatch
    // if (handlers) {
    //   await Promise.all(handlers.map(handler => handler(event)));
    // }
  }
}
