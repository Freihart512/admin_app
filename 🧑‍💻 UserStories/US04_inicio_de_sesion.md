# US04

## Inicio de Sesión (Login)

**Caso de Uso:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]

Como usuario registrado, quiero poder iniciar sesión en el sistema utilizando mis credenciales (email y contraseña), para acceder a las funcionalidades permitidas por mis roles.

### Actor

Usuario Registrado

### Objetivo

Permitir a un usuario registrado autenticarse en el sistema para obtener acceso a las funcionalidades del backend según sus roles.

### Descripción

El usuario proporcionará sus credenciales (generalmente email y contraseña) al sistema. El sistema validará estas credenciales y, si son correctas y el usuario está activo, proporcionará un mecanismo de autenticación (como un token de sesión o JWT) que el frontend u otros clientes podrán usar para interactuar con el backend en nombre del usuario autenticado. El proceso se manejará a nivel de backend.

### Criterios de Aceptación

- CA01: El sistema expone un endpoint o mecanismo en el backend para recibir las credenciales de inicio de sesión (email y contraseña).
- CA02: El sistema valida el formato del email proporcionado.
- CA03: El sistema busca un usuario con el email proporcionado.
- CA04: Si no se encuentra un usuario con el email proporcionado, el sistema rechaza la solicitud de inicio de sesión e indica un fallo de autenticación a nivel de backend.
- CA05: Si se encuentra un usuario, el sistema verifica si el usuario está activo.
- CA06: Si el usuario no está activo, el sistema rechaza la solicitud de inicio de sesión e indica un fallo de autenticación a nivel de backend (el motivo específico puede ser diferente al de credenciales incorrectas si se requiere).
- CA07: Si el usuario está activo, el sistema compara la contraseña proporcionada con la contraseña almacenada y hasheada en la base de datos para ese usuario.
- CA08: Si la contraseña no coincide, el sistema rechaza la solicitud de inicio de sesión e indica un fallo de autenticación a nivel de backend (por seguridad, el mensaje de error no debe diferenciar entre email no encontrado y contraseña incorrecta).
- CA09: Si las credenciales son correctas y el usuario está activo, el sistema genera un mecanismo de autenticación (ej. un token JWT) para la sesión del usuario.
- CA10: El sistema responde exitosamente a la solicitud de inicio de sesión proporcionando el mecanismo de autenticación generado a nivel de backend.
- CA11: Este mecanismo de autenticación (token) será necesario para que el usuario acceda a endpoints protegidos del backend en solicitudes posteriores.
- CA12: Se registra una entrada en la entidad [[🏠 Entidades/Log.md]] para auditar los intentos de inicio de sesión. Esta entrada debe incluir: un timestamp, el tipo de log (ej. 'login'), el resultado del intento (éxito/fallo), y en el campo 'context' el email proporcionado para el intento. Si el intento fue exitoso, se debe incluir el ID del usuario que inició sesión. Si el intento fue fallido, se debe registrar el motivo general del fallo (ej. 'credenciales inválidas', 'usuario inactivo') sin revelar información sensible. Se debe asignar un nivel de log apropiado (ej. 'info' para éxito, 'warn' para fallos).

---

## Relaciones

- **Caso de Uso Principal:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]
- **Entidades:**
    - [[🏠 Entidades/Usuario.md]] (La entidad que intenta iniciar sesión)
    - [[🏠 Entidades/Log.md]] (Para registrar auditoría de los intentos de login)
- **Actores:** [[🏠 Entidades/Usuario.md]] (Usuario Registrado)
