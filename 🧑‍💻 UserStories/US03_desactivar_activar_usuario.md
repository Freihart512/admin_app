# US03

## Desactivar/Activar Usuario (General - por Administrador)

**Caso de Uso:** [[📄 CasosDeUso/CU01_usuarios_y_accesos.md]]

Como administrador, quiero poder desactivar o reactivar la cuenta de usuario general de cualquier usuario (excepto mi propia cuenta de administrador activa), para controlar el acceso al sistema por motivos de seguridad o administración. La desactivación general de un usuario debe desencadenar de forma transaccional la ejecución de las lógicas de desactivación específicas de cada rol que el usuario tenga asignado.

### Actor

Administrador

### Objetivo

Permitir a un administrador cambiar el estado activo o inactivo de una cuenta de usuario en el sistema, asegurando que la desactivación general ejecute de forma transaccional las lógicas de desactivación por rol.

### Descripción

El administrador podrá seleccionar un usuario (que no sea su propia cuenta de administrador activa) y solicitar al backend cambiar su estado activo o inactivo. Desactivar un usuario implica marcar su cuenta como inactiva (`is_active = false`) y registrar la fecha de eliminación lógica (`deleted_at`), y desencadenar las lógicas de desactivación de cada rol asignado dentro de una transacción. Un usuario inactivo no podrá iniciar sesión ni realizar acciones en el sistema. Reactivar un usuario implica marcar su cuenta como activa (`is_active = true`) y borrar la fecha de eliminación lógica. Todo el proceso se gestionará a nivel de backend, interactuando con las entidades Usuario y Log.

### Criterios de Aceptación

- CA01: El sistema expone un endpoint en el backend para recibir solicitudes de cambio de estado de usuario (desactivar/activar).
- CA02: La solicitud debe incluir el mecanismo de autenticación del administrador que realiza la operación.
- CA03: La solicitud debe especificar el ID del usuario cuyo estado se va a cambiar.
- CA04: El sistema valida que el administrador que realiza la solicitud tenga los permisos necesarios.
- CA05: El sistema valida que el administrador no intente desactivar o cambiar el estado de su propia cuenta de administrador si es el único administrador activo en el sistema (para evitar bloqueos).
- CA06: El sistema busca el usuario especificado por el ID.
- CA07: Si el usuario no es encontrado, el sistema rechaza la solicitud.
- CA08: Si la solicitud es para **desactivar** el usuario:
    - CA08-1: El sistema valida que el usuario objetivo no sea la única cuenta de administrador activa (si aplica, relacionado con CA05).
    - CA08-2: El sistema inicia un proceso transaccional que abarca: la actualización del estado de la cuenta de usuario general Y la ejecución de las lógicas de desactivación específicas para cada rol que el usuario tenga asignado (Propietario, Inquilino, Contador).
    - CA08-3: La lógica de desactivación para el rol 'Propietario' (definida en US39 o donde corresponda) es ejecutada como parte de esta transacción si el usuario tiene ese rol. [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]]
    - CA08-4: Si existen lógicas de desactivación para los roles 'Inquilino' o 'Contador', estas también son ejecutadas como parte de esta transacción si el usuario tiene esos roles. (Nota: Documentar estas lógicas en las US/CUs correspondientes).
    - CA08-5: El sistema actualiza el estado de la cuenta de usuario en la base de datos dentro de esta transacción, estableciendo `is_active` a `false` y `deleted_at` a la fecha y hora actual.
    - CA08-6: Un usuario desactivado no podrá iniciar sesión ni realizar ninguna operación que requiera autenticación en el backend.
- CA09: Si la solicitud es para **activar** el usuario:
    - CA09-1: El sistema actualiza el estado del usuario en la base de datos, estableciendo `is_active` a `true` y `deleted_at` a `null`.
    - CA09-2: Un usuario reactivado, si tiene roles asignados, podrá iniciar sesión y acceder a las funcionalidades permitidas por sus roles.
- CA10: Si la transacción de desactivación de usuario (incluyendo la actualización del estado general y las lógicas de roles específicos) se completa exitosamente, el sistema confirma el éxito a nivel de procesamiento backend.
- CA11: Si alguna parte de la transacción de desactivación falla (actualización de estado general, o la lógica de desactivación de cualquiera de los roles), toda la transacción es revertida, y el estado de la cuenta de usuario y las entidades relacionadas vuelven a su estado original antes del intento de desactivación. El sistema indica un fallo a nivel de procesamiento backend con el motivo.
- CA12: Se registra una entrada en la entidad [[🏠 Entidades/Log.md]] para auditar la operación de cambio de estado de usuario. Esta entrada debe incluir: el ID del administrador que realizó la acción, el tipo de entidad ('Usuario'), el ID del usuario afectado, en el campo 'context' el cambio de estado solicitado (desactivar/activar), los roles del usuario afectado en el momento de la solicitud, y el resultado final de la operación (éxito o fallo transaccional con el motivo si aplica). Se debe asignar un nivel de log apropiado.
- CA13: (Opcional) Si la desactivación de un usuario tiene efectos colaterales en otras entidades que *no* están cubiertas por las lógicas de desactivación por rol, se podría hacer una referencia aquí.

---

## Relaciones

- **Caso de Uso Principal:** [[📄 CasosDeUso/CU01_usuarios_y_accesos.md]]
- **Entidades:**
    - [[🏠 Entidades/Usuario.md]] (La entidad cuyo estado se gestiona)
    - [[🏠 Entidades/Log.md]] (Para registrar auditoría de la operación)
- **Actores:** [[👥 Usuarios/admin.md]]
- **User Stories/Casos de Uso de Desactivación por Rol (llamados transaccionalmente):**
    - [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]] (Lógica para el rol Propietario)
    - (Si existen, añadir enlaces a las US/CUs para desactivar roles Inquilino y Contador)
