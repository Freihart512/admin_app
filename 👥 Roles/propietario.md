## Entidad: Propietario

Representa la información y el estado específico de un usuario que tiene el rol de 'propietario'. Un registro en esta entidad existe para cada [[🏠 Entidades/usuario.md|Entidad Usuario]] que tiene el rol de 'propietario'. Los datos generales del propietario (nombre, email, teléfono, dirección, RFC) residen en la [[🏠 Entidades/usuario.md|Entidad Usuario]].

### Propiedades del Sistema

- `user_id` (Identificador Único / Primary Key / Clave Foránea): El identificador único del [[🏠 Entidades/usuario.md|Entidad Usuario]] asociado. Este `user_id` sirve como clave principal para esta entidad y como enlace directo a la cuenta de usuario correspondiente, heredando de ella los datos generales como nombre, email, teléfono, dirección y RFC.
- `status`: El estado actual del registro del propietario en el sistema (e.g., 'activo', 'inactivo'). Este estado se refiere al rol específico de propietario y puede ser independiente del estado general de la cuenta de usuario (aunque la desactivación general del usuario debe impactar este estado).
- `created_at` (Marca de Tiempo): La fecha y hora en que se creó el registro de este rol de propietario.
- `updated_at` (Marca de Tiempo, Opcional): La fecha y hora en que se actualizó por última vez el registro de este rol de propietario (ej. cambio de estado, si aplica).
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se marcó el registro de este rol de propietario como eliminado lógicamente (soft delete). Cuando la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada es marcada con `deleted_at` y tiene el rol 'propietario', este registro de propietario también debe ser marcado con `deleted_at` como parte de la transacción (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]]).

### Ciclo de Vida Típico

Un registro de propietario es creado típicamente por un administrador (ver [[📄 CasosDeUso/CU01_gestionar_propietarios.md|CU01]] y [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario.md|US01]]) al añadir el rol 'propietario' a un usuario (nuevo o existente). Puede ser marcado como inactivo (eliminación lógica) por un administrador (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]], que desencadena esta lógica). La creación de un propietario (vinculado a un nuevo usuario con rol 'propietario') puede desencadenar una notificación de bienvenida (ver [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario.md|US27]]). La edición de datos generales del propietario (nombre, email, RFC, etc.) se realiza a través de la gestión de la [[🏠 Entidades/usuario.md|Entidad Usuario]] (ver [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md|US48]]).

### Impacto de la Desactivación Lógica

Cuando un registro de propietario es marcado con `deleted_at` (eliminación lógica de este rol), generalmente como parte de la desactivación lógica de la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada que tiene el rol 'propietario' (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]]), este proceso debe ser una **transacción a nivel técnico** para garantizar la consistencia. La operación de desactivación del rol de propietario, desencadenada por la desactivación general del usuario, ejecuta las siguientes acciones de forma atómica:

1.  El registro del propietario se marca como eliminado lógicamente.
2.  Todos los [[🏠 Entidades/contrato.md|Contrato]]s asociados a las propiedades de este propietario (identificado por `user_id`) que tengan `status: 'activo'` deben cambiar su estado a 'cancelado' (ver [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md|US39]]). Esto implica la cancelación de los futuros [[🏠 Entidades/pago.md|Pago]]s asociados y detiene la generación de futuras [[🏠 Entidades/factura.md|Factura]]s (ver [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06]]).
3.  Todas las [[🏠 Entidades/propiedad.md|Propiedad]]s asociadas a este propietario (identificado por `user_id`) deben ser marcadas como eliminadas lógicamente (`deleted_at` poblado).

**Nota:** El sistema **no debe permitir** marcar un registro de propietario con `deleted_at` si la transacción de desactivación no puede completarse exitosamente o dejaría datos inconsistentes.

---

### Validaciones Clave

- `user_id` debe ser una clave foránea válida que referencia a una [[🏠 Entidades/usuario.md|Entidad Usuario]] existente.
- `user_id` debe ser único en esta tabla (un usuario solo puede tener un registro como propietario).
- El `user_id` asociado debe tener el rol 'propietario' asignado en la [[🏠 Entidades/usuario.md|Entidad Usuario]].

---

### Relaciones

Un registro en la Entidad Propietario (identificado por `user_id`):

- Corresponde a una [[🏠 Entidades/usuario.md|Entidad Usuario]] con el mismo `user_id` que tiene el rol 'propietario' (relación uno a uno). **Accede a los datos generales del usuario a través de esta relación (nombre, email, teléfono, dirección, RFC).**
- Tiene una o más [[🏠 Entidades/propiedad.md|propiedad]]es (relación uno a muchos, referenciando el `user_id` del propietario en la propiedad).
- Está indirectamente asociado a los [[🏠 Entidades/contrato.md|contrato]]s creados para sus propiedades.
- Puede tener un [[👥 Usuarios/contador.md|contador]] asociado (si es una entidad separada y la relación es de Propietario a Contador, se referenciaría el `user_id` del propietario en la entidad Contador, si aplica esa dirección).

---

### 🔁 Casos de Uso Relacionados

- [[📄 CasosDeUso/CU01_gestionar_propietarios.md]] (gestiona usuarios con rol propietario - enfoque administrativo)
- [[📄 CasosDeUso/CU02_gestionar_propiedades.md]] (gestión de propiedades asociadas)
- [[📄 CasosDeUso/CU04_gestionar_contadores.md]] (para asociar contador a propietario)
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]] (consume datos de propietario)
- [[📄 CasosDeUso/CU07_notificaciones_email.md]] (propietario recibe notificaciones)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (acciones sobre propietario se loguean)
- [[📄 CasosDeUso/CU01_usuarios_y_accesos.md]] (gestión de la cuenta de usuario asociada y sus datos generales)

---

### 🧑‍💻 User Stories Relacionadas

- [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario.md]] (Asignación del rol de propietario)
- [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md]] (Principalmente desactivación del rol, posible edición de estado del rol)
- [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]] (Lógica de cascada en desactivación)
- [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md]] (Desencadena la eliminación lógica de esta entidad)
- [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md]] (Proceso de asignación del rol)
- [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md]] (Edición de datos generales del usuario, incluyendo RFC, que aplican al propietario)
- [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario.md]] (Notificación relacionada con la creación del rol)
- (Añadir aquí US donde se visualizan datos del propietario, como US03, US29, US30, US31, US34, US35 - deben obtener datos generales de Usuario y datos específicos si existen aquí).

---

### 👥 Roles Relacionados

- [[👥 Usuarios/admin.md]] (Gestiona esta entidad)
- [[👥 Usuarios/propietario.md]] (El concepto de rol asociado a la Entidad Usuario)

### 🏠 Entidades Relacionadas

- [[🏠 Entidades/usuario.md]] (La cuenta de acceso y fuente de datos generales)
- [[🏠 Entidades/propiedad.md]]
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]
- [[🏠 Entidades/pago.md]]
- [[👥 Usuarios/contador.md]] (si es una entidad separada y la relación es de propietario a contador)
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/evento.md]]
