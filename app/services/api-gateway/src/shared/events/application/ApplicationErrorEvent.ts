import { IDomainEvent } from '../IDomainEvent'; // Importamos la interfaz base

    export interface ApplicationErrorPayload {
      name: string;
      message: string;
      stack?: string;
      details?: any;
      // userId?: string; // Podría añadir userId aquí si el error ocurre en un contexto de usuario
    }

    export class ApplicationErrorEvent implements IDomainEvent { // Implementa solo IDomainEvent
      public readonly type = 'ApplicationErrorEvent';
      public readonly timestamp: Date;
      public readonly payload: ApplicationErrorPayload;

      constructor(payload: ApplicationErrorPayload) {
        this.timestamp = new Date();
        this.payload = payload;
      }
    }
