# US48

## Editar Perfil de Usuario (General)

**Caso de Uso:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]

Como usuario registrado, quiero poder actualizar la información básica de mi perfil (como nombre, teléfono), y poder solicitar la actualización de mi email, que requerirá un proceso de validación adicional para mantener la seguridad de mi cuenta. Un administrador también podrá realizar estas ediciones en nombre de cualquier usuario.

### Actor

Usuario Registrado, Administrador

### Objetivo

Permitir a los usuarios registrados (o administradores en su nombre) actualizar la información básica de su cuenta de usuario en el backend, con un proceso seguro para la modificación del email y notificación de éxito.

### Descripción

El usuario podrá enviar una solicitud al backend para actualizar campos de su perfil (nombre, teléfono, etc.). Si se solicita la modificación del email, el sistema iniciará un flujo de validación: enviará un email al *nuevo* email con un token de verificación. El usuario deberá confirmar el cambio utilizando este token. Una vez confirmado el email, se enviará una notificación de éxito. Un administrador podrá realizar estas mismas operaciones para cualquier usuario. Todo el proceso se gestionará a nivel de backend, interactuando con las entidades Notificación, Evento y Log.

### Criterios de Aceptación

- CA01: El sistema expone un endpoint en el backend para recibir solicitudes de actualización de perfil de usuario.
- CA02: La solicitud debe incluir el mecanismo de autenticación del usuario que realiza la operación (o del administrador).
- CA03: Si la solicitud es realizada por un administrador, debe incluir el ID del usuario cuyo perfil se va a editar.
- CA04: Si la solicitud es realizada por un usuario regular, la edición aplica a su propio perfil autenticado.
- CA05: El sistema permite actualizar campos básicos del perfil (ej. nombre, teléfono) sin requerir validación adicional.
- CA06: Si la solicitud incluye una modificación del campo 'email':
    - CA06-1: El sistema valida el formato del nuevo email proporcionado.
    - CA06-2: El sistema verifica si el nuevo email ya está registrado por otro usuario activo. Si es así, rechaza la operación e indica el motivo.
    - CA06-3: Si el nuevo email es válido y único, el sistema genera un token único y de tiempo limitado para la verificación del email.
    - CA06-4: El sistema almacena este token de verificación, asociándolo al usuario y al nuevo email temporalmente.
    - CA06-5: El sistema crea una nueva entrada en la entidad [[🏠 Entidades/Notificacion.md]] de tipo 'verificacion\_email', con el *nuevo* email como destinatario, y un cuerpo que incluya el token de verificación (probablemente dentro de un enlace de confirmación).
    - CA06-6: El sistema procesa el envío de esta notificación al nuevo email.
    - CA06-7: El sistema responde a la solicitud inicial de actualización de perfil indicando que se ha iniciado el proceso de verificación de email a nivel de backend. Los otros campos no relacionados con el email pueden haber sido actualizados en este punto.
- CA07: El sistema expone otro endpoint en el backend para recibir la confirmación del cambio de email, que incluye el token de verificación.
- CA08: Al recibir la confirmación, el sistema valida que el token sea válido y no haya expirado.
- CA09: Si el token no es válido o ha expirado, el sistema rechaza la confirmación e indica un fallo a nivel de backend.
- CA10: Si el token es válido, el sistema verifica que corresponda al usuario que intenta restablecer la contraseña.
- CA11: Si el token corresponde al usuario, el sistema actualiza permanentemente el campo 'email' del usuario en la base de datos con el nuevo email verificado.
- CA12: El sistema invalida el token de verificación utilizado.
- CA13: Si la confirmación del cambio de email es exitosa (CA12), el sistema crea una nueva entrada en la entidad [[🏠 Entidades/Evento.md]] de tipo 'email\_usuario\_actualizado' (o similar), asociándola al usuario afectado. Este evento contendrá la información necesaria (el nuevo email, ID del usuario).
- CA14: La creación de este evento ('email\_usuario\_actualizado') debe desencadenar la creación y envío de una [[🏠 Entidades/Notificacion.md]] de tipo 'confirmacion\_cambio\_email' al usuario con el nuevo email, informándole que el cambio se ha completado exitosamente.
- CA15: Se registran entradas en la entidad [[🏠 Entidades/Log.md]] para auditar:
    - Solicitudes de edición de perfil (por quién y para quién, y qué campos se intentaron modificar).
    - Solicitudes de cambio de email (inicio del proceso).
    - Intentos de confirmación de cambio de email (éxito o fallo).
    - La generación exitosa del evento 'email\_usuario\_actualizado'.

---

## Relaciones

- **Caso de Uso Principal:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]
- **Entidades:**
    - [[🏠 Entidades/Usuario.md]] (La entidad cuyo perfil se edita)
    - [[🏠 Entidades/Notificacion.md]] (Para el envío de emails de verificación y confirmación)
    - [[🏠 Entidades/Log.md]] (Para registrar auditoría del proceso)
    - [[🏠 Entidades/Evento.md]] (Para desencadenar la notificación de confirmación de cambio de email)
- **Actores:** [[🏠 Entidades/Usuario.md]] (Usuario Registrado), [[👥 Usuarios/admin.md]]
