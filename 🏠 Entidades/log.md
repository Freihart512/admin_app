## Entidad: Log

Representa un registro de eventos, procesos o errores significativos del sistema, particularmente aquellos relacionados con tareas automatizadas como la facturación y las notificaciones.

### Propiedades del Sistema

- `log_id` (Identificador Único): Un identificador único generado por el sistema para la entrada de log.
- `timestamp`: La fecha y hora exactas en que ocurrió el evento.
- `log_level`: El nivel de severidad del log (ej. 'INFO', 'WARNING', 'ERROR', 'CRITICAL').
- `source`: La parte del sistema que generó el log (ej. 'FacturacionAutomatica', 'NotificacionesEmail', 'Integracion SW Sapien').
- `message`: Un mensaje descriptivo que detalla el evento.
- `details` (JSON, Opcional): Datos estructurados adicionales relacionados con el evento (ej. ID de factura, ID de contrato, mensaje de error de la API externa).
- `related_entity_type` (Opcional): El tipo de entidad relacionada con el log (ej. 'Factura', 'Contrato').
- `related_entity_id` (Opcional): El ID de la entidad relacionada con el log.

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
