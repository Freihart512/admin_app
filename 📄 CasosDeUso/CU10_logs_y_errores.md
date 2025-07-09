### 🔸 CU10 - Verificar errores y logs del sistema

- US23: Como admin, quiero ver un log diario de procesos automáticos (facturación, notificaciones), para detectar errores.
- US24: Como admin, quiero recibir alertas cuando falle una factura, para actuar rápidamente.

El sistema debe mantener un registro detallado de los eventos y procesos automáticos para permitir la detección de errores y la auditoría, como se especifica en US23. Para el proceso de facturación automática (ver [[📄 CasosDeUso/CU06_facturacion_automatica.md]]), la granularidad del logging es crucial debido a la integración con sistemas externos y los mecanismos de reintento.

Por cada intento de generar una factura para un pago específico (tanto el intento inicial como cada uno de los reintentos configurados), el sistema debe registrar una entrada en la [[🏠 Entidades/log.md|Entidad Log]]. Esta entrada de log debe contener información que permita rastrear el intento y su resultado:

*   **Marca de Tiempo:** Fecha y hora exactas del intento.
*   **Fuente:** Indicar que el log proviene del proceso de facturación automática.
*   **Tipo de Evento:** Reflejar el estado del intento (ej. 'Intento de Generación de Factura', 'Éxito de Generación de Factura', 'Fallo de Generación de Factura', 'Fallo Crítico de Facturación').
*   **Nivel de Severidad:** Asignar un nivel apropiado (ej. INFO para intentos y éxitos, WARNING para fallos temporales, ERROR para fallos críticos).
*   **Identificación de Elementos:** Incluir los IDs del pago ([[🏠 Entidades/pago.md|Entidad Pago]]) y contrato ([[🏠 Entidades/contrato.md|Entidad Contrato]]) involucrados (`payment_id`, `contract_id`). Si la factura se genera exitosamente, registrar el ID de la factura (`invoice_id` de la [[🏠 Entidades/factura.md|Entidad Factura]]).
*   **Detalles del Intento:** Registrar el número de intento (1 para el inicial, 2-4 para los reintentos).
*   **Mensaje y Detalles Adicionales:** Proveer un mensaje conciso y utilizar el campo `details` (JSON) para incluir información técnica relevante, como el código y mensaje de respuesta de la API de SW Sapien ([[📄 CasosDeUso/CU09_integracion_swsapien.md|CU09]]) en caso de fallo, o mensajes de error internos del sistema.

El registro detallado de estos eventos en el Log facilita a los administradores, tal como se describe en US23, la revisión del historial de facturación automática y la identificación de patrones o causas raíz de los fallos. Las alertas (US24) se basan en estos eventos de error registrados.

---

### 📎 Enlaces relacionados
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[🏠 Entidades/log.md]]
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]]
- [[🏠 Entidades/pago.md]]
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]