## Entidad: Log

Represents a record of significant system events, processes, or errors, particularly those related to automated tasks like invoicing and notifications.

### Propiedades del Sistema

- `log_id` (Unique Identifier): A unique system-generated identifier for the log entry.
- `timestamp`: The exact date and time the event occurred.
- `log_level`: The severity level of the log (e.g., 'INFO', 'WARNING', 'ERROR', 'CRITICAL').
- `source`: The part of the system that generated the log (e.g., 'FacturacionAutomatica', 'NotificacionesEmail', 'SW Sapien Integration').
- `message`: A descriptive message detailing the event.
- `details` (JSON, Optional): Additional structured data related to the event (e.g., invoice ID, contract ID, error message from external API).
- `related_entity_type` (Optional): The type of entity related to the log (e.g., 'Factura', 'Contrato').
- `related_entity_id` (Optional): The ID of the entity related to the log.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU10_logs_y_errores.md]]
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]]
- [[📄 CasosDeUso/CU09_integracion_swsapien.md]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US22_seguimiento_integracion_con_sw_sapien.md]]
- [[🧑‍💻 UserStories/US23_logs_procesos_automaticos.md]]
- [[🧑‍💻 UserStories/US24_US24_alerta_de_fallo_factura.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]

### 🏠 Entidades Relacionadas

La entidad `Log` puede estar relacionada con otras entidades a través de los campos `related_entity_type` y `related_entity_id` para proporcionar contexto adicional a los eventos registrados. Algunas de las entidades con las que un log podría estar relacionado incluyen:

- [[🏠 Entidades/factura.md]]
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/pago.md]]
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/propiedad.md]]
- [[🏠 Entidades/inquilino.md]]
- [[🏠 Entidades/propietario.md]]
- [[🏠 Entidades/contador.md]]