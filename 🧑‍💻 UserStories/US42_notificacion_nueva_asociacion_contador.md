## 🧑‍💻 User Story: US42 - Notificación al contador sobre nueva asociación de propietario

**Como** sistema,
**Quiero** enviar un email de notificación a un contador cuando un administrador le asocia un propietario adicional,
**Para** informarle sobre la nueva relación y el acceso a la información fiscal de las propiedades de ese propietario.

### Criterios de Aceptación (Backend - Suscriptor de Evento)

CA01: Debe existir un componente o servicio en el backend que esté **suscrito al evento** `contador.propietario.asociado` en el Event Bus local.
CA02: Al recibir el evento `contador.propietario.asociado`, el componente suscriptor debe utilizar los IDs del contador (`contadorId`) y del propietario (`propietarioId`) proporcionados en el payload para recuperar la información completa de ambos, incluyendo las direcciones de email y los nombres.
CA03: El backend verifica que el contador tenga una dirección de email válida registrada.
CA04: Si la dirección de email del contador es válida, el backend construye un correo electrónico de notificación utilizando una plantilla predefinida. El contenido debe informar al contador que ha sido asociado con el propietario cuyo nombre se indica, y explicar brevemente las implicaciones (ej. que ahora podrá acceder a la información fiscal de sus propiedades).
CA05: El backend utiliza su servicio de envío de emails configurado para enviar este correo al contador.
CA06: El backend registra que la notificación fue enviada (o intentada) al contador, como parte del registro general de notificaciones y/o logs auditables.
CA07: Manejo de errores: Si no se detecta un email válido, falta información del contador/propietario, o si falla el servicio de envío de email *durante el manejo del evento*, el sistema registra estos errores de forma adecuada y no interrumpe el procesamiento de otros eventos o funcionalidades.

### Enlaces relacionados

- [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07: Enviar notificaciones por email]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[👥 Usuarios/contador.md|Rol Contador]]
- [[👥 Usuarios/propietario.md|Rol Propietario]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]] (Emisor: `contador.propietario.asociado`)
- [[🧑‍💻 UserStories/US10_editar_contador.md|US10: Editar o cambiar datos de un contador]] (Emisor del evento `contador.propietario.asociado`)
