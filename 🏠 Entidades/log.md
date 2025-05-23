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
- [[📄 CasosDeUso/CU10_logs_y_errores]]
- [[📄 CasosDeUso/CU06_facturacion_automatica]]
- [[📄 CasosDeUso/CU09_integracion_swsapien]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US22_CU09_integrar_con_sw_sapien]]
- [[🧑‍💻 UserStories/US23_CU10_verificar_errores_y_logs_del_sistema]]
- [[🧑‍💻 UserStories/US24_CU10_verificar_errores_y_logs_del_sistema]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin]]