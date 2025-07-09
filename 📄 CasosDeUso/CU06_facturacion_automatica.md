### 🔸 CU06 - Generar facturas automáticamente

- US14: Como sistema, quiero generar automáticamente una factura en la fecha de cada uno de los pagos de cada contrato activo, usando los datos fiscales del propietario y del inquilino (ver detalles del proceso a continuación).
- US15: Como propietario, quiero ver y descargar las facturas emitidas por cada propiedad, para mantener mi contabilidad.

El proceso de generación automática de facturas para US14 se activa mediante una tarea programada (referenciada conceptualmente como <CODE_BLOCK>job</CODE_BLOCK>). Esta tarea es creada por el sistema al generar un <CODE_BLOCK>Pago</CODE_BLOCK> y se programa para ejecutarse exactamente en la fecha de vencimiento (<CODE_BLOCK>due_date</CODE_BLOCK>) de dicho pago. Al ejecutarse, el <CODE_BLOCK>job</CODE_BLOCK> toma la información necesaria del contrato, propietario e inquilino para intentar generar la factura correspondiente a través de una integración con el sistema externo SW Sapien (ver [[📄 CasosDeUso/CU09_integracion_swsapien.md|CU09]]). En caso de que el intento de comunicación o generación en SW Sapien falle, el sistema reintentará la operación hasta 3 veces adicionales, con un intervalo de 2 horas entre cada reintento. Cada fallo en el intento de generación o reintento debe despachar un <CODE_BLOCK>Evento</CODE_BLOCK> de error y generar una <CODE_BLOCK>Notificacion</CODE_BLOCK> dirigida a los administradores. Si todos los intentos (inicial más reintentos) fallan, se genera un <CODE_BLOCK>Evento</CODE_BLOCK> de error crítico y una <CODE_BLOCK>Notificacion</CODE_BLOCK> de alta prioridad para los administradores, indicando la necesidad de intervención manual. Si el proceso de generación de factura en SW Sapien es exitoso, el sistema genera un <CODE_BLOCK>Evento</CODE_BLOCK> de éxito y activa <CODE_BLOCK>Notificacion</CODE_BLOCK>es para todos los roles relevantes involucrados (administrador, propietario, inquilino y contador). Adicionalmente, el estado del <CODE_BLOCK>Pago</CODE_BLOCK> asociado se actualiza a "Facturado".

---

### 📎 Enlaces relacionados
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[📄 CasosDeUso/CU09_integracion_swsapien.md|CU09: Integración con SW Sapien]]
- [[📄 CasosDeUso/CU07_notificaciones_email]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/contrato.md|Entidad Contrato]]
- [[🏠 Entidades/pago.md|Entidad Pago]]
- [[🏠 Entidades/factura.md|Entidad Factura]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[🏠 Entidades/log.md|Entidad Log]]
- [[🏠 Entidades/notificacion.md|Entidad Notificación]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md|Rol Admin]]
- [[👥 Usuarios/propietario.md|Rol Propietario]]
- [[👥 Usuarios/inquilino.md|Rol Inquilino]]
- [[👥 Usuarios/contador.md|Rol Contador]]