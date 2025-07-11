# US01

## Asignar Rol de Propietario a Usuario

**Caso de Uso:** [[📄 CasosDeUso/CU01_gestionar_propietarios.md|CU01 - Gestionar Propietarios]], [[📄 CasosDeUso/CU11_usuarios_y_accesos.md|CU11 - Gestión General de Usuarios y Accesos]]

Como **Admin**, quiero asignar el rol de 'Propietario' a un usuario existente (o crear un nuevo usuario y asignarle el rol), para que pueda ser gestionado como propietario en el sistema. Al asignar el rol, el sistema debe validar que el usuario cumpla con los requisitos de datos generales obligatorios para ese rol.

### Actor

Administrador

### Objetivo

Permitir a un administrador asignar el rol de 'Propietario' a una cuenta de usuario existente o nueva, asegurando que la cuenta de usuario asociada cumpla con los requisitos de datos generales para el rol de Propietario.

### Descripción

El administrador iniciará el proceso proporcionando la información del usuario que será propietario. El sistema debe manejar dos escenarios:
1.  **Asignar el rol a un usuario existente:** El administrador identifica un usuario ya registrado en el sistema. El sistema valida si este usuario puede tener el rol de Propietario y, si es así, procede a asignárselo.
2.  **Crear un nuevo usuario y asignarle el rol:** El administrador proporciona los datos para crear una nueva cuenta de usuario. El sistema crea la cuenta de usuario base (usando el flujo de US25) y luego le asigna el rol de Propietario.

En ambos escenarios, antes de confirmar la asignación del rol de Propietario, el sistema debe validar que la entidad [[🏠 Entidades/usuario.md]] asociada cumpla con los requisitos de datos generales obligatorios para el rol de Propietario (RFC, teléfono, dirección son obligatorios para este rol, y nombre, apellido son obligatorios para todos).

Tras la asignación exitosa del rol de Propietario a un usuario, el sistema debe desencadenar la notificación de bienvenida si se trata de un usuario que acaba de adquirir este rol por primera vez y cumple ciertos criterios (ver US27).

### Criterios de Aceptación

- CA01: El administrador puede iniciar el proceso para asignar el rol de Propietario a un usuario.
- CA02: El sistema permite al administrador:
    - Opción A: Seleccionar un usuario existente en el sistema.
    - Opción B: Proporcionar los datos necesarios para crear una nueva cuenta de usuario (mínimamente email, nombre, apellido).
- CA03: Si el administrador opta por crear un nuevo usuario (CA02-Opción B), el sistema inicia el flujo de registro general de usuario (ver [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md|US25 - Registro de Nuevo Usuario]]) utilizando los datos proporcionados. Este flujo incluye la generación de contraseña inicial y la validación de campos obligatorios para la creación básica de usuario (email, nombre, apellido).
- CA04: Si la creación del nuevo usuario (CA03) es exitosa, o si el administrador seleccionó un usuario existente (CA02-Opción A), el sistema procede a **asignar el rol de 'Propietario'** a la entidad [[🏠 Entidades/usuario.md]] asociada. Este proceso de asignación de rol utiliza la lógica definida en [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md|US45 - Asignar/Modificar Roles de Usuario (Administrador)]].
- CA05: Como parte del proceso de asignación del rol de Propietario (CA04, a través de la lógica de US45), el sistema valida que la entidad [[🏠 Entidades/usuario.md]] asociada cumpla con los requisitos de datos generales OBLIGATORIOS para el rol de Propietario:
    - CA05-1: El campo 'rfc' en la entidad [[🏠 Entidades/Usuario.md]] debe estar presente, tener un formato válido y ser único a nivel global.
    - CA05-2: Los campos 'phone\_number' y 'address' en la entidad [[🏠 Entidades/Usuario.md]] deben estar presentes y no vacíos.
    - CA05-3: Los campos 'name' y 'last\_name' en la entidad [[🏠 Entidades/Usuario.md]] deben estar presentes y no vacíos (esta validación ya debería ser parte de US25/US48, pero se reitera aquí para claridad del requisito del rol).
- CA06: Si la entidad [[🏠 Entidades/usuario.md]] asociada no cumple con alguno de los requisitos de datos generales obligatorios para el rol de Propietario (CA05), el sistema rechaza la operación de asignación de rol e indica qué datos faltan o son inválidos a nivel de procesamiento backend. La cuenta de usuario base (si se acaba de crear) podría ser marcada como incompleta o pendiente, o revertida (decisión de diseño).
- CA07: Si todas las validaciones son exitosas, el sistema asigna el rol de 'Propietario' al usuario utilizando la lógica de [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md|US45]].
- CA08: Si es la primera vez que a este usuario se le asigna el rol de Propietario y cumple los criterios para la notificación de bienvenida (ej. es un usuario nuevo registrado con este rol), el sistema desencadena el proceso de notificación de bienvenida (ver [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario.md|US27 - Enviar notificación de bienvenida a nuevo propietario]]).
- CA09: Se registra una entrada en la entidad [[🏠 Entidades/Log.md]] para auditar la acción del administrador de asignar el rol de Propietario a un usuario, incluyendo el ID del usuario afectado, el resultado de la operación (éxito o fallo) y el motivo del fallo si aplica.

---

## Relaciones

- **Caso de Uso Principal:** [[📄 CasosDeUso/CU01_gestionar_propietarios.md]]
- **Casos de Uso Relacionados:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]] (Gestión General de Usuarios y Roles)
- **User Stories Llamadas/Referenciadas:**
    - [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md]] (Para crear un nuevo usuario base si es necesario)
    - [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md]] (Para la lógica de asignación del rol y sus validaciones intrínsecas)
    - [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario.md]] (Desencadenada tras asignación exitosa a usuario nuevo)
- **Entidades:**
    - [[🏠 Entidades/Usuario.md]] (La entidad que adquiere el rol y contiene los datos validados)
    - [[👥 Usuarios/propietario.md|Entidad Propietario]] (El registro de la entidad específica del rol que se crea si no existe)
    - [[🏠 Entidades/Log.md]] (Para auditoría)
    - [[🏠 Entidades/Notificacion.md]] (A través de US27)
    - [[🏠 Entidades/Evento.md]] (Si US27 se desencadena por evento)
- **Actores:** [[👥 Usuarios/admin.md]]
