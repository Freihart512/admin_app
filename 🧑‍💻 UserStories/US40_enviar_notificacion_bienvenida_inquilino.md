## 🧑‍💻 User Story: US40 - Enviar notificación de bienvenida a nuevo inquilino

**Como** sistema,
**Quiero** enviar un email de bienvenida al inquilino recién creado,
**Para** proporcionarle sus credenciales de acceso al sistema e información inicial relevante.

### Criterios de Aceptación (Backend - Suscriptor de Evento)

CA01: Debe existir un componente o servicio en el backend que esté **suscrito al evento** `inquilino.creado` en el Event Bus local.
CA02: Al recibir el evento `inquilino.creado`, el componente suscriptor debe utilizar el ID del inquilino proporcionado en el payload del evento para recuperar la información completa del inquilino, incluyendo su dirección de email y (de forma segura, ej. un token temporal o indicación de cómo establecerla) la forma de acceder al sistema.
CA03: El backend verifica que el inquilino tenga una dirección de email válida registrada.
CA04: Si la dirección de email es válida, el backend construye un correo electrónico de bienvenida utilizando una plantilla predefinida. El contenido debe incluir un saludo, confirmar la creación de su cuenta y proporcionar instrucciones claras sobre cómo acceder al sistema (ej. enlace de inicio de sesión, quizás un token para el primer acceso o instrucciones para establecer contraseña).
CA05: El backend utiliza su servicio de envío de emails configurado para enviar este correo al inquilino.
CA06: El backend registra que la notificación de bienvenida fue enviada (o intentada) al inquilino, como parte del registro general de notificaciones y/o logs auditables.
CA07: Manejo de errores: Si no se detecta un email válido o si falla el servicio de envío de email *durante el manejo del evento*, el sistema registra estos errores de forma adecuada y no interrumpe el procesamiento de otros eventos o funcionalidades.

### Enlaces relacionados

- [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07: Enviar notificaciones por email]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[🏠 Entidades/inquilino.md|Entidad Inquilino]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]] (Emisor: `inquilino.creado`)
- [[🧑‍💻 UserStories/US07_crud_inquilinos_admin.md|US07: CRUD inquilinos admin]] (Emisor del evento `inquilino.creado`)
