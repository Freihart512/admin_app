// app/services/api-gateway/src/shared/events/application/HandlerExecutionFailedEvent.ts
import { IDomainEvent } from '../IDomainEvent';

export interface HandlerExecutionFailedPayload {
  originalEventType: string;
  originalEventPayload: any; // O un tipo más específico si es posible
  handlerName?: string; // Opcional: Identificador del manejador que falló
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  // Puedes añadir otros detalles de contexto si son relevantes
  // timestampOfFailure: Date; // Ya está en la clase del evento
  // userId?: string; // Si el evento original tenía un contexto de usuario
}

export class HandlerExecutionFailedEvent implements IDomainEvent {
  public readonly type = 'HandlerExecutionFailedEvent'; // Nombre único del evento
  public readonly timestamp: Date;

  constructor(public readonly payload: HandlerExecutionFailedPayload) {
    this.timestamp = new Date();
  }
}
