# US45

## Asignar/Modificar Roles de Usuario (Administrador)

**Caso de Uso:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]

Como administrador, quiero poder asignar o modificar los roles (Propietario, Inquilino, Contador, Administrador) a un usuario existente, para controlar sus permisos y funcionalidades a nivel de sistema, asegurando que se cumplan las reglas de obligatoriedad de datos generales (nombre, apellido, teléfono, dirección, RFC) basadas en los roles asignados.

### Actor

Administrador

### Objetivo

Permitir a un administrador gestionar los roles asociados a una cuenta de usuario existente, asegurando la aplicación de las reglas de negocio sobre la combinación de roles y la obligatoriedad de ciertos datos generales del usuario basados en los roles asignados.

### Descripción

El administrador podrá, a través de la funcionalidad de gestión de usuarios, seleccionar un usuario existente y modificar la asignación de roles asociados a su cuenta a nivel del sistema de backend. Las modificaciones de roles deben adherirse a las reglas de negocio definidas: un usuario siempre debe tener al menos un rol, el rol de Administrador es exclusivo (no puede combinarse con otros roles), y los roles Propietario, Inquilino y Contador son compatibles entre sí. Adicionalmente, al asignar roles de Propietario o Inquilino, el sistema validará que los campos de la entidad [[🏠 Entidades/Usuario.md]] 'rfc', 'phone\_number' y 'address' estén presentes y sean válidos, y que los campos 'name' y 'last\_name' estén presentes para cualquier rol.

### Criterios de Aceptación

- CA01: El sistema permite al administrador seleccionar un usuario existente para gestionar sus roles.
- CA02: El sistema proporciona al administrador la información actual de los roles asignados al usuario seleccionado, así como sus datos generales (name, last\_name, email, phone\_number, address, rfc) de la entidad [[🏠 Entidades/Usuario.md]].
- CA03: El sistema presenta al administrador la lista de roles disponibles para asignación (Propietario, Inquilino, Contador, Administrador).
- CA04: El sistema permite al administrador solicitar la asignación de uno o varios roles al usuario.
- CA05: El sistema permite al administrador solicitar la eliminación de roles asignados al usuario.
- CA06: El sistema valida que la solicitud de modificación de roles resulte en que el usuario tenga al menos un rol asignado. Si la eliminación de un rol resultaría en cero roles, la operación es rechazada.
- CA07: El sistema valida que si se intenta asignar el rol de Administrador a un usuario, este usuario NO pueda tener ningún otro rol asignado simultáneamente. La operación es rechazada si se intenta asignar otro rol a un administrador o asignar el rol de administrador a un usuario con otros roles.
- CA08: El sistema valida que un usuario con el rol de Administrador activo no pueda eliminarse a sí mismo el rol de Administrador.
- CA09: El sistema permite que un usuario tenga los roles de Propietario, Inquilino y Contador asignados simultáneamente, si así se solicita.
- **CA10: Antes de aplicar los cambios de rol, el sistema valida la obligatoriedad de los datos generales en la [[🏠 Entidades/Usuario.md]] basándose en el CONJUNTO FINAL de roles que tendrá el usuario después de la modificación:**
    - CA10-1: Si el conjunto final de roles INCLUYE 'Propietario' o 'Inquilino', el sistema valida que los campos 'rfc', 'phone\_number' y 'address' en la entidad [[🏠 Entidades/Usuario.md]] del usuario estén presentes, tengan un formato válido y (para RFC) sea único a nivel global (excluyendo al propio usuario). Si faltan o son inválidos, la operación de modificación de roles es rechazada con un mensaje indicando qué campos son requeridos o inválidos.
    - CA10-2: El sistema valida que los campos 'name' y 'last\_name' en la entidad [[🏠 Entidades/Usuario.md]] del usuario estén presentes y no vacíos. Si faltan, la operación de modificación de roles es rechazada.
    - CA10-3: Si el conjunto final de roles NO incluye 'Propietario' ni 'Inquilino', los campos 'phone\_number' y 'address' son opcionales y no se validan por obligatoriedad en este punto (aunque sí se validan por formato si se proporcionan).
- CA11: Si todas las validaciones (CA06 a CA10) son exitosas, el sistema actualiza los roles del usuario en la base de datos.
- CA12: Si la solicitud es válida (incluyendo las validaciones de datos generales), el sistema confirma el éxito de la operación a nivel de procesamiento backend.
- CA13: Si la solicitud no es válida según los CAs de validación (CA06 a CA10), el sistema rechaza la operación y proporciona una indicación del motivo a nivel de procesamiento backend (especificando qué validación falló, incluyendo las de datos generales).
- CA14: La actualización de los roles del usuario a nivel de base de datos debe afectar los permisos y la funcionalidad a la que tiene acceso el usuario en interacciones futuras con el backend.
- CA15: Se registra una entrada en la entidad [[🏠 Entidades/Log.md]] para auditar la operación de modificación de roles. Esta entrada debe incluir: el ID del administrador que realizó la acción, el tipo de entidad ('Usuario'), el ID del usuario afectado, en el campo 'context' los roles solicitados (roles a añadir y roles a eliminar), el conjunto final de roles del usuario, y el resultado de la operación (éxito o fallo con el motivo de la validación, incluyendo fallos de validación de datos generales). Se debe asignar un nivel de log apropiado (ej. 'info' para éxito, 'warn' o 'error' para fallos de validación).

---

## Relaciones

- **Caso de Uso Principal:** [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]]
- **Entidades:**
    - [[🏠 Entidades/Usuario.md]] (La entidad cuyo rol y datos generales se gestionan/validan)
    - [[🏠 Entidades/Log.md]] (Para registrar auditoría de la operación)
    - [[🏠 Entidades/Evento.md]] (Potencialmente, si un cambio de rol significativo dispara un evento de sistema)
- **Actores:** [[👥 Usuarios/admin.md]]
