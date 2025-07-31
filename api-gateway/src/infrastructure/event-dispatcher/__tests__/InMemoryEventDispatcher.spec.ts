// Importamos la clase que vamos a probar
import { InMemoryEventDispatcher } from '../InMemoryEventDispatcher';
// Importamos la interfaz base de eventos para crear eventos de prueba
import { IDomainEvent } from '../../../shared/events/IDomainEvent';

// Definimos una interfaz para un evento de prueba
interface TestEventPayload {
  data: string;
}

interface TestEvent extends IDomainEvent {
  type: 'TestEvent';
  payload: TestEventPayload;
}

// Definimos una interfaz para otro evento de prueba
interface AnotherEventPayload {
  value: number;
}

interface AnotherEvent extends IDomainEvent {
  type: 'AnotherEvent';
  payload: AnotherEventPayload;
}

describe('InMemoryEventDispatcher (Unit Test)', () => {
  let eventDispatcher: InMemoryEventDispatcher;

  beforeEach(() => {
    // Creamos una nueva instancia del dispatcher antes de cada prueba
    eventDispatcher = new InMemoryEventDispatcher();
    vi.clearAllMocks(); // Limpiamos cualquier mock que hayamos creado en beforeEach de otros archivos (aunque aquí no hay muchos mocks que limpiar)
  });

  // --- Prueba: subscribe y dispatch ---
  it('should call subscribed handlers when an event of the correct type is dispatched', async () => {
    // Creamos mocks de manejadores de eventos
    const handler1 = vi.fn(async (event: TestEvent) => {});
    const handler2 = vi.fn(async (event: TestEvent) => {});

    // Suscribimos los manejadores al tipo de evento 'TestEvent'
    eventDispatcher.subscribe('TestEvent', handler1);
    eventDispatcher.subscribe('TestEvent', handler2);

    // Creamos una instancia del evento de prueba
    const testEvent: TestEvent = {
      type: 'TestEvent',
      timestamp: new Date(),
      payload: { data: 'some test data' },
    };

    // Emitimos el evento
    await eventDispatcher.dispatch(testEvent);

    // Verificamos que ambos manejadores suscritos a 'TestEvent' fueron llamados
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith(testEvent); // Verificamos que se llamó con el evento correcto
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith(testEvent);
  });

  // --- Prueba: Multiple event types ---
  it('should only call handlers subscribed to the dispatched event type', async () => {
    const testHandler = vi.fn(async (event: TestEvent) => {});
    const anotherHandler = vi.fn(async (event: AnotherEvent) => {});

    // Suscribimos manejadores a diferentes tipos de eventos
    eventDispatcher.subscribe('TestEvent', testHandler);
    eventDispatcher.subscribe('AnotherEvent', anotherHandler);

    // Emitimos un evento de tipo 'TestEvent'
    const testEvent: TestEvent = {
      type: 'TestEvent',
      timestamp: new Date(),
      payload: { data: 'some test data' },
    };
    await eventDispatcher.dispatch(testEvent);

    // Verificamos que el manejador de 'TestEvent' fue llamado
    expect(testHandler).toHaveBeenCalledTimes(1);
    expect(testHandler).toHaveBeenCalledWith(testEvent);

    // Verificamos que el manejador de 'AnotherEvent' NO fue llamado
    expect(anotherHandler).not.toHaveBeenCalled();

    // Emitimos un evento de tipo 'AnotherEvent'
    const anotherEvent: AnotherEvent = {
      type: 'AnotherEvent',
      timestamp: new Date(),
      payload: { value: 123 },
    };
    await eventDispatcher.dispatch(anotherEvent);

    // Verificamos que el manejador de 'AnotherEvent' fue llamado esta vez
    expect(anotherHandler).toHaveBeenCalledTimes(1);
    expect(anotherHandler).toHaveBeenCalledWith(anotherEvent);

    // Verificamos que el manejador de 'TestEvent' NO fue llamado de nuevo
    expect(testHandler).toHaveBeenCalledTimes(1); // Sigue siendo 1 del dispatch anterior
  });

  // --- Prueba: unsubscribe ---
  it('should not call handlers after they have been unsubscribed', async () => {
    const handler1 = vi.fn(async (event: TestEvent) => {});
    const handler2 = vi.fn(async (event: TestEvent) => {});

    // Suscribimos ambos manejadores
    eventDispatcher.subscribe('TestEvent', handler1);
    eventDispatcher.subscribe('TestEvent', handler2);

    // Desuscribimos handler1
    eventDispatcher.unsubscribe('TestEvent', handler1);

    const testEvent: TestEvent = {
      type: 'TestEvent',
      timestamp: new Date(),
      payload: { data: 'some data' },
    };

    // Emitimos el evento
    await eventDispatcher.dispatch(testEvent);

    // Verificamos que handler1 NO fue llamado
    expect(handler1).not.toHaveBeenCalled();

    // Verificamos que handler2 SÍ fue llamado (porque no fue desuscrito)
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith(testEvent);

    // Desuscribimos handler2 también y emitimos de nuevo
    eventDispatcher.unsubscribe('TestEvent', handler2);
    await eventDispatcher.dispatch(testEvent);

    // Verificamos que ninguno de los manejadores fue llamado esta vez
    expect(handler1).not.toHaveBeenCalled(); // Sigue siendo 0
    expect(handler2).toHaveBeenCalledTimes(1); // Sigue siendo 1 del dispatch anterior
  });

  // --- Prueba: No handlers subscribed ---
  it.only('should not throw an error if no handlers are subscribed for a dispatched event type', async () => {
    const testEvent: IDomainEvent = {
      type: 'NonSubscribedEvent', // Un tipo de evento para el que no hay manejadores
      timestamp: new Date(),
      payload: { data: 'some data' },
    };

    // Emitimos el evento - esperamos que no lance ningún error
    await expect(eventDispatcher.dispatch(testEvent)).resolves.toBeUndefined();

    // Verificamos que console.warn fue llamado para indicar que no hay manejadores
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('No handlers subscribed for event type: NonSubscribedEvent')
    );
  });

  // --- Prueba: Handler throws an error ---
  it('should catch errors thrown by handlers and not stop other handlers', async () => {
    const throwingHandler = vi.fn(async (event: TestEvent) => {
      throw new Error('Simulated handler error'); // Este manejador lanzará un error
    });
    const goodHandler = vi.fn(async (event: TestEvent) => {
      // Este manejador no lanza errores
    });

    eventDispatcher.subscribe('TestEvent', throwingHandler);
    eventDispatcher.subscribe('TestEvent', goodHandler); // Suscribimos ambos manejadores al mismo evento

    const testEvent: TestEvent = {
      type: 'TestEvent',
      timestamp: new Date(),
      payload: { data: 'error test' },
    };

    // Emitimos el evento - esperamos que el dispatch en sí no lance un error
    await expect(eventDispatcher.dispatch(testEvent)).resolves.toBeUndefined();

    // Verificamos que ambos manejadores fueron llamados
    expect(throwingHandler).toHaveBeenCalledTimes(1);
    expect(goodHandler).toHaveBeenCalledTimes(1); // El error en throwingHandler NO debe impedir que goodHandler se ejecute

    // Verificamos que console.error fue llamado para loguear el error del manejador
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error handling event TestEvent by a handler:'),
      expect.any(Error) // Debe haber logueado el error simulado
    );
  });

  // --- Prueba: async handlers ---
  it('should execute async handlers without waiting for their completion by default', async () => {
    const handler1 = vi.fn(async (event: TestEvent) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 100ms
    });
    const handler2 = vi.fn(async (event: TestEvent) => {});

    eventDispatcher.subscribe('TestEvent', handler1);
    eventDispatcher.subscribe('TestEvent', handler2);

    const testEvent: TestEvent = {
      type: 'TestEvent',
      timestamp: new Date(),
      payload: { data: 'async test' },
    };

    // Emitimos el evento - el dispatch debería completarse rápidamente (no espera los 100ms del handler1)
    await eventDispatcher.dispatch(testEvent);

    // Verificamos que ambos manejadores fueron llamados inmediatamente
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    // Nota: No podemos verificar *cuando* terminaron los manejadores asíncronos
    // con un simple expect después del dispatch, ya que el dispatch no espera.
    // Pero sí verificamos que fueron llamados.
    // Si necesitaras esperar a que terminaran para otras aserciones, podrías:
    // 1. Hacer que el dispatcher retorne un Promise.all de las ejecuciones de handlers (cambiando la implementación)
    // 2. Añadir esperas manuales en la prueba (ej. await vi.waitFor(() => { ... }))
    // Para esta prueba, verificar la llamada es suficiente para el comportamiento fire-and-forget.
  });

  // --- Prueba: subscribe with duplicate handler ---
  it('should not subscribe the same handler multiple times to the same event type', async () => {
    const handler = vi.fn(async (event: TestEvent) => {});

    eventDispatcher.subscribe('TestEvent', handler);
    eventDispatcher.subscribe('TestEvent', handler); // Intentar suscribir el mismo handler de nuevo

    const testEvent: TestEvent = {
      type: 'TestEvent',
      timestamp: new Date(),
      payload: { data: 'duplicate test' },
    };

    await eventDispatcher.dispatch(testEvent);

    // El manejador solo debería haber sido llamado una vez
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(testEvent);
  });
});
