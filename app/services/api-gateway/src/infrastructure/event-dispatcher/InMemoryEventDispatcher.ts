import { IEventDispatcher } from '../../shared/events/IEventDispatcher';
import { IDomainEvent } from '../../shared/events/IDomainEvent';
 // Importamos las interfaces desde shared

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
    console.log(`Subscribing handler to event type: ${eventType}`);
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
    console.log(`Unsubscribing handler from event type: ${eventType}`);
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
    console.log(`Dispatching event: ${event.type}`, event.payload);
    const handlers = this.handlers[event.type];

    if (handlers) {
      // Ejecutar cada manejador de forma asíncrona.
      // No esperamos el resultado de cada manejador para no bloquear el proceso de negocio que emitió el evento.
      handlers.forEach(handler => {
        // Encapsular la ejecución en un Promise.resolve() y catch para manejar errores en los handlers
        Promise.resolve(handler(event))
          .catch(handlerError => {
            console.error(`Error handling event ${event.type} by a handler:`, handlerError);
            // Podrías emitir un ApplicationErrorEvent aquí para registrar el fallo del handler
            // Aunque esto podría llevar a bucles si el manejador de ApplicationErrorEvent también falla
          });
      });
    } else {
      console.warn(`No handlers subscribed for event type: ${event.type}`);
    }

    // Opcional: Si quieres esperar a que todos los manejadores terminen antes de que termine el dispatch (menos común para fire-and-forget)
    // if (handlers) {
    //   await Promise.all(handlers.map(handler => handler(event)));
    // }
  }
}
