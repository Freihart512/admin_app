# US50

## Listar Usuarios (Administrador)

**Caso de Uso:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]

Como administrador, quiero poder ver un listado de todas las cuentas de usuario registradas en el sistema, con información básica y sus roles, para tener una visión general de los usuarios y facilitar la gestión.

### Actor

Administrador

### Objetivo

Permitir a un administrador obtener una lista de todas las cuentas de usuario existentes en el backend, incluyendo información relevante.

### Descripción

El administrador podrá solicitar al backend un listado de todas las cuentas de usuario. El sistema responderá con una lista de objetos de usuario, cada uno conteniendo atributos básicos (como ID, email, nombre, estado activo/inactivo) y los roles asignados. Se pueden incluir opciones para filtrar y ordenar la lista.

### Criterios de Aceptación

- CA01: El sistema expone un endpoint en el backend para que el administrador solicite el listado de usuarios.
- CA02: La solicitud debe incluir el mecanismo de autenticación del administrador.
- CA03: El sistema valida que el usuario autenticado tenga el rol de Administrador para acceder a esta funcionalidad.
- CA04: Si el usuario no es un administrador, el sistema rechaza la solicitud con un error de autorización.
- CA05: Si el usuario es un administrador, el sistema recupera todas las cuentas de usuario de la base de datos.
- CA06: Para cada usuario en la lista, el sistema incluye atributos clave como:
    - ID del usuario
    - Email
    - Nombre completo (si está disponible en la entidad Usuario)
    - Estado (activo/inactivo) (`is_active`, `deleted_at`)
    - Roles asignados (lista de roles)
- CA07: El sistema puede soportar parámetros de filtrado en la solicitud para refinar la lista devuelta (ej. filtrar por estado activo/inactivo, filtrar por rol específico, filtrar por email o nombre parcial).
- CA08: El sistema puede soportar parámetros de ordenación en la solicitud para especificar el criterio de orden de la lista (ej. ordenar por email, por fecha de creación).
- CA09: Si se aplican filtros o ordenación, el sistema devuelve la lista de usuarios que coinciden con los criterios y en el orden especificado.
- CA10: El sistema responde exitosamente con la lista de usuarios en el formato adecuado a nivel de backend.
- CA11: Si no hay usuarios registrados (más allá del propio administrador que realiza la consulta, si esa es una regla), o si los filtros no arrojan resultados, el sistema responde con una lista vacía y una indicación de éxito (ej. HTTP 200 OK con lista vacía).
- CA12: Se registra una entrada en la entidad [[🏠 Entidades/Log.md]] para auditar la solicitud de listado de usuarios por parte del administrador, incluyendo posibles parámetros de filtrado/ordenación utilizados.

---

## Relaciones

- **Caso de Uso Principal:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]
- **Entidades:**
    - [[🏠 Entidades/Usuario.md]] (La entidad que se lista)
    - [[🏠 Entidades/Log.md]] (Para registrar auditoría de la operación)
- **Actores:** [[👥 Usuarios/admin.md]]
