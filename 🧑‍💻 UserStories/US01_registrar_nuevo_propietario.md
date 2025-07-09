# US01

## Registrar nuevo propietario

**Caso de Uso:** [[📄 CasosDeUso/CU01_gestionar_propietarios]]

Como **Admin**, quiero registrar un nuevo **Propietario** con sus datos básicos (nombre, correo electrónico, contraseña), datos fiscales y de contacto, para poder gestionar sus propiedades y contratos en el sistema.

**Detalles Backend:**
- Además del dato fiscal (RFC) y de contacto (teléfono opcional, dirección física opcional), se deben registrar los datos básicos de la entidad [[🏠 Entidades/usuario]] necesarios para la cuenta del propietario, incluyendo nombre, apellido y correo electrónico. El sistema debe **generar automáticamente una contraseña provisional** para el nuevo usuario.
- Al registrarse, al nuevo usuario se le debe asignar automáticamente el rol de 'Propietario'.
- Tras el registro exitoso, el sistema debe **enviar una notificación de bienvenida** al correo electrónico proporcionado, incluyendo la contraseña provisional generada. Este proceso también sirve como **validación del correo electrónico**.
- Este envío de notificación está detallado en la [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario|US27 - Enviar notificación de bienvenida a nuevo propietario]].
### Criterios de Aceptación

- **CA01:** El Admin puede ingresar los datos requeridos para un nuevo propietario (datos básicos de usuario, fiscales - solo RFC, de contacto opcionales) en la interfaz de registro.
- **CA02:** Al guardar, el sistema crea un nuevo registro en la entidad [[🏠 Entidades/usuario]] con el rol 'Propietario' asignado.
- **CA03:** El dato fiscal (RFC) y los datos de contacto opcionales proporcionados se guardan correctamente asociados al usuario.
- **CA04:** El sistema **genera automáticamente una contraseña provisional segura** y la asocia al nuevo usuario (hasheada de forma segura antes de almacenarla).
- **CA05:** El nuevo propietario aparece en la lista de propietarios gestionables por el Admin.
- **CA06:** Si se intenta registrar un usuario con un correo electrónico o RFC que ya existe en el sistema (si estas validaciones aplican), el sistema muestra un mensaje de error apropiado y no crea el registro duplicado.
- **CA07:** El sistema valida que los campos obligatorios estén completos antes de permitir el registro.
 - **CA08:** Tras el registro exitoso, el sistema **envía una notificación de bienvenida** al correo electrónico del nuevo propietario.
 - **CA09:** La notificación de bienvenida **incluye la contraseña provisional** generada.
 - **CA10:** El envío exitoso de la notificación **valida la existencia y accesibilidad del correo electrónico**.
 - **CA11:** Tras el registro exitoso de un nuevo propietario por parte de un administrador, el sistema debe generar un registro en la [[🏠 Entidades/log.md|Log]], detallando la acción y el usuario afectado, según lo especificado en el caso de uso [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10]].