## Entidad: Evento

Representa una ocurrencia significativa dentro del sistema que es emitida por un componente y a la cual otros componentes pueden reaccionar (suscribirse). Los eventos son una parte fundamental de la arquitectura basada en eventos del sistema, permitiendo el desacoplamiento entre las funcionalidades que generan las acciones y las que reaccionan a ellas.

Un evento es una notificación de que "algo sucedió", no una solicitud para que "algo suceda".

### Propiedades

- **ID (Identificador Único del Evento):** Un identificador único para cada instancia de evento emitida (UUID). Útil para trazabilidad y depuración.
- **Tipo de Evento:** Un string que clasifica el evento (ej. `contrato.cancelado`, `factura.generada`, `propietario.creado`, `pago.recibido`). Define la naturaleza de lo que ocurrió.
- **Fecha y Hora de Emisión:** Timestamp exacto en que el evento fue generado por el sistema.
- **Origen/Componente Emisor:** Indica qué parte del sistema (servicio, módulo, User Story) emitió el evento. Útil para auditoría y depuración.
- **Datos Asociados (Payload):** Un objeto o estructura de datos (ej. JSON) que contiene la información relevante sobre la ocurrencia del evento. Esta información debe ser suficiente para que los suscriptores puedan actuar sin tener que consultar extensivamente otros servicios o la base de datos. Por ejemplo, para un evento `contrato.cancelado`, el payload podría incluir el ID del contrato, IDs del propietario e inquilino, fecha de cancelación, etc.
- **Estado de Procesamiento (Opcional):** Si el sistema implementa mecanismos robustos de entrega de eventos (ej. colas de mensajes), podría rastrear el estado de procesamiento del evento por parte de los suscriptores. (Esto es más avanzado, podemos omitirlo inicialmente si queremos simplificar).

### Relaciones Potenciales

- **Generado por:** User Stories o Procesos del Sistema.
- **Manejado por:** Otros Casos de Uso, User Stories o Componentes/Servicios específicos (ej. el servicio de notificaciones por email se suscribe a varios tipos de eventos).
- **Relacionado con:** Otras Entidades del sistema (el payload del evento a menudo contendrá IDs o datos de otras entidades como Contrato, Propiedad, Usuario, Factura, etc.).

### Consideraciones de Implementación

- **Garantía de Entrega:** Definir el nivel de garantía necesario para la entrega de eventos (ej. "at-most-once", "at-least-once", "exactly-once"). "At-least-once" es común y requiere que los suscriptores sean idempotentes.
- **Infraestructura de Eventos:** El sistema podría utilizar una cola de mensajes (ej. RabbitMQ, Kafka, AWS SQS) o un bus de eventos interno para gestionar la emisión y distribución de eventos.
- **Versionado de Eventos:** Considerar cómo manejar la evolución de los tipos de eventos y sus payloads a lo largo del tiempo.

### Eventos Específicos del Sistema (Ejemplos)

- `contrato.creado`
- `contrato.actualizado`
- `contrato.cancelado`
- `factura.generada`
- `pago.recibido`
- `propiedad.creada`
- `usuario.creado` (con subtipos por rol, ej. `usuario.propietario.creado`)

Para una lista completa y detallada de los eventos del sistema y sus emisores/suscriptores, ver: [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]]
