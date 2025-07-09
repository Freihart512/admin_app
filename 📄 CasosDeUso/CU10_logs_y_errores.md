### 🔸 CU10 - Verificar errores y logs del sistema

Este caso de uso abarca la funcionalidad del sistema para registrar, almacenar y permitir la consulta de logs y errores. Los logs son fundamentales para la auditoría, la depuración, el monitoreo del sistema y la detección proactiva de problemas. El sistema debe generar logs para procesos automáticos críticos y para acciones administrativas clave.

- US23: Como admin, quiero ver un log diario de procesos automáticos (facturación, notificaciones), para detectar errores.
- US24: Como admin, quiero recibir alertas cuando falle una factura, para actuar rápidamente.

El sistema debe mantener un registro detallado de los eventos y procesos automáticos para permitir la detección de errores y la auditoría, como se especifica en US23. Para el proceso de facturación automática (ver [[📄 CasosDeUso/CU06_facturacion_automatica.md]]), la granularidad del logging es crucial debido a la integración con sistemas externos y los mecanismos de reintento.

Por cada intento de generar una factura para un pago específico (tanto el intento inicial como cada uno de los reintentos configurados), el sistema debe registrar una entrada en la [[🏠 Entidades/log.md|Entidad Log]]. Esta entrada de log debe contener información que permita rastrear el intento y su resultado:

*   **Marca de Tiempo:** Fecha y hora exactas del intento.
*   **Fuente:** Indicar que el log proviene del proceso de facturación automática (e.g., 'FacturacionAutomatica').
*   **Tipo de Evento:** Reflejar el estado del intento (ej. \'Intento de Generación de Factura\', \'Éxito de Generación de Factura\', \'Fallo de Generación de Factura\', \'Fallo Crítico de Facturación\').
*   **Nivel de Severidad:** Asignar un nivel apropiado (ej. INFO para intentos y éxitos, WARNING para fallos temporales, ERROR para fallos críticos).
*   **Identificación de Elementos:** Incluir los IDs del pago ([[🏠 Entidades/pago.md|Entidad Pago]]) y contrato ([[🏠 Entidades/contrato.md|Entidad Contrato]]) involucrados (<CODE_BLOCK>payment_id</CODE_BLOCK>, <CODE_BLOCK>contract_id</CODE_BLOCK>). Si la factura se genera exitosamente, registrar el ID de la factura (<CODE_BLOCK>invoice_id</CODE_BLOCK> de la [[🏠 Entidades/factura.md|Entidad Factura]]).
*   **Detalles del Intento:** Registrar el número de intento (1 para el inicial, 2-4 para los reintentos).
*   **Mensaje y Detalles Adicionales:** Proveer un mensaje conciso y utilizar el campo <CODE_BLOCK>details</CODE_BLOCK> (JSON) para incluir información técnica relevante, como el código y mensaje de respuesta de la API de SW Sapien ([[📄 CasosDeUso/CU09_integracion_swsapien.md|CU09]]) en caso de fallo, o mensajes de error internos del sistema.

El registro detallado de estos eventos en el Log facilita a los administradores, tal como se describe en US23, la revisión del historial de facturación automática y la identificación de patrones o causas raíz de los fallos. Las alertas (US24) se basan en estos eventos de error registrados.

### Logging de Acciones Administrativas

Además de los procesos automáticos, el sistema debe registrar en la [[🏠 Entidades/log.md|Entidad Log]] las acciones de gestión realizadas por un administrador sobre las entidades de negocio principales: [[👥 Usuarios/propietario.md|Propietario]], [[👥 Usuarios/inquilino.md|Inquilino]] y [[👥 Usuarios/contador.md|Contador]]. Esto es crucial para la auditoría y la trazabilidad de los cambios en los datos clave del sistema.

Cada registro de log para una acción administrativa debe incluir:

*   **Marca de Tiempo:** Fecha y hora exactas en que se realizó la acción.
*   **Usuario Actor:** El <CODE_BLOCK>user_id</CODE_BLOCK> del administrador que realizó la acción.
*   **Tipo de Acción:** Indicar el tipo de operación y la entidad afectada (ej. 'Entidad Propietario Registrada', 'Entidad Inquilino Actualizada', 'Entidad Contador Eliminada Lógicamente').
*   **Nivel de Severidad:** Típicamente INFO para acciones exitosas. ERROR o WARNING si la acción falló.
*   **Identificación de la Entidad Afectada:** El <CODE_BLOCK>entity_type</CODE_BLOCK> ('Propietario', 'Inquilino', 'Contador') y el <CODE_BLOCK>related_entity_id</CODE_BLOCK> (<CODE_BLOCK>user_id</CODE_BLOCK> de la entidad de negocio afectada).
*   **Origen:** El **endpoint de la API o el nombre del servicio/modelo interno** que procesó la solicitud de la acción administrativa (ej. 'POST /api/v1/owners', 'InquilinoService.update()'). Este campo en la [[🏠 Entidades/log.md|Entidad Log]] debe ser utilizado para este propósito.
*   **Detalles de los Cambios (en caso de Edición):** Para las acciones de 'Entidad [Tipo de Entidad] Actualizada', el campo <CODE_BLOCK>details</CODE_BLOCK> (JSON) del Log debe registrar los campos específicos que fueron modificados, incluyendo sus valores anteriores y nuevos (ej. {"campo_modificado": {"old": "valor_anterior", "new": "valor_nuevo"}}).

El registro de estas acciones administrativas en el Log permite a los administradores auditar quién realizó qué cambios y cuándo, contribuyendo a la seguridad y la integridad de los datos del sistema.

---

### 📎 Enlaces relacionados
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[🏠 Entidades/log.md]]
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]]
- [[🏠 Entidades/pago.md]]
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/contador.md]]
