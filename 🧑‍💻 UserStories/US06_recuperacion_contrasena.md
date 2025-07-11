# US06

## Recuperación de Contraseña

**Caso de Uso:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]

Como usuario que ha olvidado mi contraseña, quiero poder solicitar un proceso de recuperación para restablecer mi acceso al sistema.

### Actor

Usuario Registrado (con contraseña olvidada)

### Objetivo

Permitir a un usuario restablecer su contraseña de acceso al sistema de forma segura.

### Descripción

El usuario iniciará el proceso proporcionando su email. El sistema validará el email, generará un token único y de tiempo limitado, y enviará un correo electrónico al usuario conteniendo un enlace o código para restablecer la contraseña. El usuario utilizará este enlace/código para establecer una nueva contraseña. Todo el proceso, incluyendo la generación y validación del token y el envío del correo, se gestionará a nivel de backend, interactuando con la entidad Notificación para el envío del email.

### Criterios de Aceptación

- CA01: El sistema expone un endpoint en el backend para recibir la solicitud de recuperación de contraseña, que incluye el email del usuario.
- CA02: El sistema valida el formato del email proporcionado.
- CA03: El sistema busca un usuario activo con el email proporcionado.
- CA04: Si no se encuentra un usuario activo con el email proporcionado, el sistema responde con una indicación de que el proceso se ha iniciado (sin confirmar si el email existe por seguridad) a nivel de backend. (Nota: Esto evita enumeración de usuarios).
- CA05: Si se encuentra un usuario activo, el sistema genera un token único y de tiempo limitado asociado a ese usuario para el proceso de restablecimiento.
- CA06: El sistema almacena este token de restablecimiento, asociándolo al usuario y registrando su fecha de expiración.
- CA07: El sistema crea una nueva entrada en la entidad [[🏠 Entidades/Notificacion.md]] de tipo 'recuperacion\_contrasena', con el usuario como destinatario, y un cuerpo que incluya el token de restablecimiento (probablemente dentro de un enlace o como un código).
- CA08: El sistema procesa el envío de esta notificación por email. (Nota: El éxito o fallo del envío del email puede ser asíncrono y logueado por el sistema de notificaciones).
- CA09: El sistema expone otro endpoint en el backend para recibir la nueva contraseña junto con el token de restablecimiento.
- CA10: Al recibir la nueva contraseña y el token, el sistema valida que el token sea válido y no haya expirado.
- CA11: Si el token no es válido o ha expirado, el sistema rechaza la solicitud de restablecimiento e indica un fallo a nivel de backend.
- CA12: Si el token es válido, el sistema verifica que corresponda al usuario que intenta restablecer la contraseña.
- CA13: Si el token corresponde al usuario, el sistema valida la complejidad o formato de la nueva contraseña (si hay reglas definidas).
- CA14: Si la nueva contraseña es válida, el sistema hashea la nueva contraseña y la actualiza en la base de datos para el usuario asociado al token.
- CA15: El sistema invalida el token de restablecimiento utilizado para evitar su reutilización.
- CA16: Si la solicitud de restablecimiento es exitosa (token válido, contraseña válida), el sistema confirma el éxito de la operación a nivel de procesamiento backend.
- CA17: Si la solicitud de restablecimiento falla por validación de contraseña, el sistema rechaza la operación e indica el motivo a nivel de procesamiento backend.
- CA18: Se registran entradas en la entidad [[🏠 Entidades/Log.md]] para auditar las solicitudes de recuperación de contraseña (inicio y resultado) y los intentos de restablecimiento de contraseña (éxito o fallo, con el motivo si es posible sin comprometer la seguridad).

---

## Relaciones

- **Caso de Uso Principal:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]
- **Entidades:**
    - [[🏠 Entidades/Usuario.md]] (El usuario que recupera la contraseña)
    - [[🏠 Entidades/Notificacion.md]] (Para el envío del email de recuperación)
    - [[🏠 Entidades/Log.md]] (Para registrar auditoría del proceso)
- **Actores:** [[🏠 Entidades/Usuario.md]] (Usuario Registrado)
