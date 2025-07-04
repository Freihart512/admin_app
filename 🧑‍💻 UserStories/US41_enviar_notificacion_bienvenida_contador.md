## 🧑‍💻 User Story: US41 - Enviar notificación de bienvenida a nuevo contador

**Como** sistema,
**Quiero** enviar un email de bienvenida al contador recién registrado,
**Para** proporcionarle información relevante sobre su asociación a propietarios y cómo recibirá las notificaciones fiscales.

### Criterios de Aceptación (Backend - Suscriptor de Evento)

CA01: Debe existir un componente o servicio en el backend que esté **suscrito al evento** `contador.creado` en el Event Bus local.
CA02: Al recibir el evento `contador.creado`, el componente suscriptor debe utilizar el ID del contador proporcionado en el payload del evento para recuperar la información completa del contador, incluyendo su dirección de email y la lista de propietarios a los que está asociado.
CA03: El backend verifica que el contador tenga una dirección de email válida registrada.
CA04: Si la dirección de email es válida, el backend construye un correo electrónico de bienvenida utilizando una plantilla predefinida. El contenido debe incluir un saludo, confirmar su registro como contador en el sistema, mencionar a los propietarios con los que ha sido asociado inicialmente, y proporcionar información general sobre el tipo de notificaciones que recibirá (ej. sobre facturas generadas).
CA05: El backend utiliza su servicio de envío de emails configurado para enviar este correo al contador.
CA06: El backend registra que la notificación de bienvenida fue enviada (o intentada) al contador, como parte del registro general de notificaciones y/o logs auditables.
CA07: Manejo de errores: Si no se detecta un email válido o si falla el servicio de envío de email *durante el manejo del evento*, el sistema registra estos errores de forma adecuada y no interrumpe el procesamiento de otros eventos o funcionalidades.

### Enlaces relacionados

- [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07: Enviar notificaciones por email]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[👥 Usuarios/contador.md|Rol Contador]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]] (Emisor: `contador.creado`)
- [[🧑‍💻 UserStories/US09_registrar_nuevo_contador.md|US09: Registrar nuevo contador]] (Emisor del evento `contador.creado`)
