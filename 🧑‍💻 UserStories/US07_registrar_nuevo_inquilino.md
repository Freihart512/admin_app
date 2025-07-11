# US07

## Gestionar Inquilinos (Crear, Editar, Eliminar)

**Caso de Uso:** [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]]

Como admin, quiero crear, editar y eliminar inquilinos, para asociarlos a contratos de renta.

### Actor

Admin

### Objetivo

Proporcionar al administrador las herramientas necesarias para mantener un registro preciso y actualizado de los inquilinos en el sistema.

### Criterios de Aceptación

#### Crear Nuevo Inquilino

- CA01: El [[👤 Perfiles/administrador|administrador]] puede acceder a un formulario para registrar un nuevo [[👥 Usuarios/inquilino|inquilino]].
- CA02: El formulario para crear un [[👥 Usuarios/inquilino|inquilino]] incluye los campos: Nombre Completo, Correo Electrónico, Número de Teléfono (opcional) y RFC (opcional).
- CA03: Los campos Nombre Completo y Correo Electrónico son obligatorios al crear un [[👥 Usuarios/inquilino|inquilino]].
- CA04: El sistema valida el formato del Correo Electrónico proporcionado.
- CA05: El sistema guarda la información del nuevo [[👥 Usuarios/inquilino|inquilino]] correctamente.
- CA06: Tras un registro exitoso, el sistema muestra un mensaje de confirmación y/o redirige al [[👤 Perfiles/administrador|administrador]] al listado de inquilinos (según [[🧑‍💻 UserStories/US08_listar_inquilinos.md|US08]]) o a los detalles del inquilino creado.
- CA07: Si falta información obligatoria o los datos no son válidos durante la creación, el sistema muestra mensajes de error claros.
- CA07a: Si se proporciona un RFC o Número de Teléfono, el sistema valida que sean únicos en el sistema. Si ya existen para otro inquilino activo, rechaza la creación con un mensaje de error.\
- CA07a: Tras un registro exitoso de un nuevo [[👥 Usuarios/inquilino|inquilino]], el sistema debe emitir el evento `inquilino.creado` en el Event Bus local, incluyendo al menos el identificador único del inquilino creado en el payload.

#### Editar Inquilino Existente

- CA08: El [[👤 Perfiles/administrador|administrador]] puede seleccionar un [[👥 Usuarios/inquilino|inquilino]] existente desde el listado (según [[🧑‍💻 UserStories/US08_listar_inquilinos.md|US08]]) o una vista de detalles para editar su información.
- CA09: El sistema carga la información actual del [[👥 Usuarios/inquilino|inquilino]] seleccionado en un formulario de edición.
- CA10: El [[👤 Perfiles/administrador|administrador]] puede modificar los campos: Nombre Completo, Correo Electrónico, Número de Teléfono y RFC, y el estado del inquilino.
- CA11: Los campos obligatorios (Nombre Completo, Correo Electrónico) mantienen su validación durante la edición.
- CA12: El sistema guarda los cambios realizados en la información del [[👥 Usuarios/inquilino|inquilino]].
- CA13: Tras una edición exitosa, el sistema muestra un mensaje de confirmación y/o redirige al [[👤 Perfiles/administrador|administrador]] al listado o a los detalles del inquilino.
- CA14: Si la información editada no es válida, el sistema muestra mensajes de error claros.

- CA14a: Si se proporciona un RFC o Número de Teléfono editado, el sistema valida que el valor sea único en el sistema (excluyendo el inquilino que se está editando). Si ya existe para otro inquilino activo, rechaza la edición con un mensaje de error.\
- CA14b: Si el campo RFC es modificado, el sistema debe emitir un evento de tipo 'RFC de Inquilino Actualizado'. Este evento debe generar notificaciones automáticas para todos los [[👤 Perfiles/administrador|administradores]] y el [[👥 Usuarios/contador|contador]] asociado al propietario de los contratos activos de este inquilino (si aplica).


#### Eliminar Inquilino

- CA15: El [[👤 Perfiles/administrador|administrador]] puede seleccionar un [[👥 Usuarios/inquilino|inquilino]] existente desde el listado (según [[🧑‍💻 UserStories/US08_listar_inquilinos.md|US08]]) o una vista de detalles para eliminarlo.
- CA16: El sistema solicita confirmación al [[👤 Perfiles/administrador|administrador]] antes de proceder con la eliminación.
- CA17: El sistema realiza una eliminación lógica del registro del [[👥 Usuarios/inquilino|inquilino]] (marcando `deleted_at`).
- CA18: Tras una eliminación lógica exitosa, el [[👥 Usuarios/inquilino|inquilino]] ya no aparece en los listados activos por defecto, pero puede ser accesible en vistas de historial si se requiere.
- CA19: Si el [[👥 Usuarios/inquilino|inquilino]] tiene [[🏠 Entidades/contrato|contratos]] activos o recientes que impiden su eliminación lógica (según las reglas de negocio que definen qué se considera "reciente"), el sistema impide la eliminación y muestra un mensaje explicativo al [[👤 Perfiles/administrador|administrador]] indicando la razón.
- CA19: Al marcar un inquilino como eliminado lógicamente (`deleted_at` poblado), el sistema debe cancelar automáticamente todos los contratos asociados a este inquilino que tengan el estado 'activo'. La cancelación de estos contratos desencadenará a su vez la cancelación de los pagos futuros asociados y detendrá la generación de futuras facturas para esos pagos.
- CA19a: El proceso de marcar un inquilino como eliminado lógicamente y cancelar sus contratos activos debe realizarse dentro de una **transacción técnica** para asegurar su atomicidad. Si alguna parte de la operación falla (ej. error al cancelar contrato), se debe revertir toda la operación.\
- CA19b: Tras una eliminación lógica exitosa de un inquilino, el sistema debe emitir un evento de tipo 'Inquilino Desactivado'. Este evento debe generar notificaciones automáticas para todos los [[👤 Perfiles/administrador|administradores]] y el [[👥 Usuarios/propietario.md|propietario]] de las propiedades asociadas a los contratos activos del inquilino que fueron cancelados como parte de esta acción.
- CA20: El sistema debe manejar los casos en los que la eliminación no sea posible debido a otras razones (por ejemplo, dependencias no cubiertas por la cascada actual, errores técnicos, etc.) y mostrar un mensaje de error apropiado.\

#### Logging

- CA21: Toda creación de inquilino debe generar un registro en el [[🏠 Entidades/log.md|Log]] detallando la acción, el administrador que la realizó y el inquilino creado (ver [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10]]).
- CA22: Toda edición de inquilino debe generar un registro en el [[🏠 Entidades/log.md|Log]] detallando la acción, el administrador que la realizó, el inquilino afectado y los **detalles de los campos que fueron modificados** (valores antiguos y nuevos) (ver [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10]]).
- CA23: Toda eliminación lógica de inquilino debe generar un registro en el [[🏠 Entidades/log.md|Log]] detallando la acción, el administrador que la realizó, el inquilino afectado, y si se cancelaron contratos asociados como parte de la acción (ver [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10]]).