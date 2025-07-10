## 🧑‍💻 User Story: US38 - Notificación por email al cancelar contrato

**Como** sistema,
**Quiero** enviar una notificación por email al propietario e inquilino,
**Para** informarles cuando un contrato ha sido cancelado.

### Criterios de Aceptación (Backend - Suscriptor de Evento)

CA01: Debe existir un componente o servicio en el backend que esté **suscrito al evento** `contrato.cancelado` en el Event Bus local.
CA02: Al recibir el evento `contrato.cancelado`, el componente suscriptor debe utilizar el ID del contrato proporcionado en el payload del evento para recuperar la información completa del contrato cancelado, incluyendo la [[🏠 Entidades/propiedad|Propiedad]] asociada y los [[👥 Usuarios/inquilino|Inquilino]] y [[👥 Usuarios/propietario|Propietario]] involucrados.
CA03: El backend verifica que el [[👥 Usuarios/inquilino|Inquilino]] y el [[👥 Usuarios/propietario|Propietario]] asociados al contrato tengan direcciones de email válidas registradas.
CA04: Si las direcciones de email son válidas, el backend construye un correo electrónico informativo dirigido al [[👥 Usuarios/propietario|Propietario]], utilizando los datos recuperados. El contenido debe indicar que el contrato para la propiedad X ha sido cancelado, incluyendo detalles relevantes (fechas, propiedad, etc.).
CA05: El backend construye un correo electrónico informativo similar dirigido al [[👥 Usuarios/inquilino|Inquilino]], utilizando los datos recuperados. El contenido debe indicar que su contrato para la propiedad X ha sido cancelado, incluyendo detalles relevantes e instrucciones si aplican.
CA06: El backend utiliza su servicio de envío de emails configurado para enviar estos correos al Propietario y al Inquilino.
CA07: El backend registra que la notificación por email fue activada por la cancelación del contrato, incluyendo a quiénes se intentó enviar y el resultado (éxito/fallo del envío por cada destinatario), como parte del registro general de notificaciones y/o logs auditables.
CA08: Manejo de errores: Si no se detecta un email válido para Propietario o Inquilino, o si falla el servicio de envío de email *durante el manejo del evento*, el sistema registra estos errores de forma adecuada y no interrumpe el procesamiento de otros eventos o funcionalidades. Los reintentos de envío deben ser gestionados por el servicio de notificaciones.

### Enlaces relacionados

- [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07: Enviar notificaciones por email]]
- [[🏠 Entidades/contrato.md|Entidad Contrato]]
- [[🏠 Entidades/propiedad.md|Entidad Propiedad]]
- [[👥 Usuarios/inquilino.md|Inquilino]]
- [[👥 Usuarios/propietario.md|Propietario]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13: Cancelar contrato]] (Emisor del evento `contrato.cancelado`)
