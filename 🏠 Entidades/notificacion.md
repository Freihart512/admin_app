## Entidad: Notificación

Representa un registro de una notificación enviada por el sistema a un usuario (inquilino, propietario, contador) sobre un evento relevante, como la generación de una factura.

### Propiedades del Sistema

- `notification_id` (Unique Identifier): Un identificador único generado por el sistema para la notificación.
- `recipient_type` (Enum: 'inquilino', 'propietario', 'contador'): El tipo de usuario que recibe la notificación.
- `recipient_id` (Foreign Key): Un enlace al identificador único del usuario que recibe la notificación (puede ser un `tenant_id`, `owner_id` o el ID del contador si se gestionan como usuarios).
- `notification_type` (String): El tipo de notificación (ej. 'factura_generada', 'pago_vencido_proximo').
- `subject` (String): El asunto del correo electrónico de notificación.
- `body` (Text): El contenido del correo electrónico de notificación.
- `related_entity_type` (Optional String): El tipo de entidad relacionada con la notificación (ej. 'Factura', 'Contrato').
- `related_entity_id` (Optional Foreign Key): El identificador de la entidad relacionada con la notificación.
- `sent_at` (Timestamp): La fecha y hora en que se envió la notificación.
- `status` (Enum: 'enviada', 'fallida', 'reintentando'): El estado actual de la notificación.
- `error_message` (Optional Text): Detalles del error si el envío falló.
- `created_at`: Timestamp para cuando se creó el registro de notificación.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU07_notificaciones_email.md]]
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US16_notificacion_email.md]]
- [[🧑‍💻 UserStories/US16_notificacion_email.md]]
- [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario]]
- [[🧑‍💻 UserStories/US23_logs_procesos_automaticos.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/contador.md]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/factura]]
- [[🏠 Entidades/contrato]]
- [[🏠 Entidades/usuario]]