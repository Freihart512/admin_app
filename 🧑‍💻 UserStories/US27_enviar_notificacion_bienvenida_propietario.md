# US27

## Enviar notificación de bienvenida a nuevo propietario

**Caso de Uso:** [[📄 CasosDeUso/CU07_notificaciones_email]], [[📄 CasosDeUso/CU01_gestionar_propietarios]]

Como sistema, quiero enviar una notificación de bienvenida por correo electrónico a un nuevo propietario registrado, incluyendo su contraseña provisional, para informarle de su alta y validar su correo electrónico.

### Actor

Sistema

### Objetivo

Informar y dar acceso inicial al nuevo propietario vía email.

### Criterios de Aceptación

- CA01: Tras el registro exitoso de un propietario ([[🧑‍💻 UserStories/US01_registrar_nuevo_propietario]]), el sistema genera y envía automáticamente una notificación por correo electrónico a la dirección proporcionada.
- CA02: La notificación incluye un saludo de bienvenida y la contraseña provisional generada para la cuenta del propietario.
- CA03: El envío exitoso de la notificación confirma que la dirección de correo electrónico proporcionada es válida y accesible.
- CA04: Si el envío de la notificación falla (ej. dirección de correo inválida), el sistema registra el error ([[📄 CasosDeUso/CU10_logs_y_errores]], [[🧑‍💻 UserStories/US23_CU10_logs_errores]]) y posiblemente notifica al Admin ([[📄 CasosDeUso/CU07_notificaciones_email]], [[🧑‍💻 UserStories/US24_CU07_notificaciones_alerta_admin]]).