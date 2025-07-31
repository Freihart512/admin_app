// app/services/api-gateway/src/shared/events/eventMap.ts

import { IDomainEvent } from './IDomainEvent';
// Importa las interfaces de payload y las clases de todos tus eventos
// Asegúrate de que las rutas de importación sean correctas
import { UserLoggedInEvent, UserLoggedInPayload } from './authentication/UserLoggedInEvent';
import {
  UserLoginFailedEvent,
  UserLoginFailedPayload,
} from './authentication/UserLoginFailedEvent';
import {
  HandlerExecutionFailedEvent,
  HandlerExecutionFailedPayload,
} from './application/HandlerExecutionFailedEvent';
import {
  ApplicationErrorEvent,
  ApplicationErrorPayload,
} from './application/ApplicationErrorEvent'; // Inclúyelo si decides mantenerlo definido

// Define un mapeo de tipos de eventos string a sus interfaces de eventos correspondientes.
// Esto crea una relación tipada entre el string y la estructura del evento.
export interface EventMap {
  UserLoggedInEvent: IDomainEvent<'UserLoggedInEvent', UserLoggedInPayload>;
  UserLoginFailedEvent: IDomainEvent<'UserLoginFailedEvent', UserLoginFailedPayload>;
  HandlerExecutionFailedEvent: IDomainEvent<
    'HandlerExecutionFailedEvent',
    HandlerExecutionFailedPayload
  >;
  ApplicationErrorEvent: IDomainEvent<'ApplicationErrorEvent', ApplicationErrorPayload>; // Inclúyelo si decides mantenerlo

  // Añade todos tus eventos aquí, siguiendo el patrón:
  // 'OtroEventoType': IDomainEvent<'OtroEventoType', OtroEventoPayloadInterface>;
  // 'PasswordChangedEvent': IDomainEvent<'PasswordChangedEvent', PasswordChangedPayload>;
  // 'PasswordChangeFailedEvent': IDomainEvent<'PasswordChangeFailedEvent', PasswordChangeFailedPayload>;
  // ... etc.
}

// Tipo de utilidad para representar cualquier evento en nuestro sistema
export type AppEvent = EventMap[keyof EventMap];

// Tipo de utilidad para obtener el tipo de payload dado un tipo de evento string
export type EventPayload<T extends keyof EventMap> = EventMap[T]['payload'];

// Tipo de utilidad para obtener la interfaz del evento dado un tipo de evento string
export type EventFromType<T extends keyof EventMap> = EventMap[T];
