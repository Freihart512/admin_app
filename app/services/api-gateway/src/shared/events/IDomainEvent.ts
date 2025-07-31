// app/services/api-gateway/src/shared/events/IDomainEvent.ts

// Interfaz base para todos los eventos de dominio
// TType extends string = string: El tipo string literal de este evento (ej. 'UserLoggedInEvent').
//                                El '= string' lo hace opcional para compatibilidad inicial si no se especifica.
// TPayload = any: El tipo de la carga útil (payload) del evento.
//                 El '= any' lo hace opcional para compatibilidad inicial si no se especifica.
export interface IDomainEvent<TType extends string = string, TPayload = any> {
  readonly type: TType; // El tipo específico del evento, ahora tipado con un literal string
  readonly timestamp: Date; // Marca de tiempo de cuándo ocurrió el evento
  readonly payload: TPayload; // La carga útil con los datos relevantes del evento
}
