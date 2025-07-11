## Entidad: Inquilino

Representa la información y el estado específico de un usuario que tiene el rol de 'inquilino'. Un registro en esta entidad existe para cada [[🏠 Entidades/usuario.md|Entidad Usuario]] que tiene el rol de 'inquilino'. Los datos generales del inquilino (nombre, email, teléfono, dirección, RFC) residen en la [[🏠 Entidades/usuario.md|Entidad Usuario]].

### Propiedades del Sistema

- `user_id` (Identificador Único / Primary Key / Clave Foránea): El identificador único del [[🏠 Entidades/usuario.md|Entidad Usuario]] asociado. Este `user_id` sirve como clave principal para esta entidad y como enlace directo a la cuenta de usuario correspondiente, heredando de ella los datos generales como nombre, email, teléfono, dirección y RFC.
- `status`: El estado actual del registro del inquilino en el sistema (e.g., 'activo', 'eliminado'). Este estado se refiere al rol específico de inquilino y puede ser independiente del estado general de la cuenta de usuario (aunque la desactivación general del usuario debe impactar este estado).
- `created_at` (Marca de Tiempo): La fecha y hora en que se creó el registro de este rol de inquilino.
- `updated_at` (Marca de Tiempo, Opcional): La fecha y hora en que se actualizó por última vez el registro de este rol de inquilino.
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se marcó el registro de este rol de inquilino como eliminado lógicamente (soft delete). Cuando la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada es marcada con `deleted_at` y tiene el rol 'inquilino', este registro de inquilino también debe ser marcado con `deleted_at` como parte de la transacción (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]]).

### Ciclo de Vida Típico

Un registro de inquilino es creado típicamente por un administrador (ver [[📄 CasosDeUso/CU03_gestionar_inquilinos.md|CU03]] y [[🧑‍💻 UserStories/US07_registrar_nuevo_inquilino.md|US07]]) al añadir el rol 'inquilino' a un usuario (nuevo o existente). Puede ser marcado como eliminado lógicamente por un administrador (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]], que desencadena esta lógica). La creación de un inquilino (vinculado a un nuevo usuario con rol 'inquilino') puede desencadenar una notificación de bienvenida (ver [[🧑‍💻 UserStories/US40_enviar_notificacion_bienvenida_inquilino.md|US40]]). La edición de datos generales del inquilino (nombre, email, RFC, etc.) se realiza a través de la gestión de la [[🏠 Entidades/usuario.md|Entidad Usuario]] (ver [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md|US48]]).

### Impacto de la Eliminación Lógica

Cuando un registro de inquilino es marcado con `deleted_at` (eliminación lógica de este rol), generalmente como parte de la desactivación lógica de la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada que tiene el rol 'inquilino' (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]]), este proceso debe ser una **transacción a nivel técnico** para garantizar la consistencia. La operación de desactivación del rol de inquilino, desencadenada por la desactivación general del usuario, ejecuta las siguientes acciones de forma atómica:

1.  El registro del inquilino se marca como eliminado lógicamente.
2.  Todos los [[🏠 Entidades/contrato.md|Contrato]]s asociados a este inquilino (identificado por `user_id`) que tengan `status: 'activo'` deben cambiar su estado a 'cancelado' (ver [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13]]). Esto implica la cancelación de los futuros [[🏠 Entidades/pago.md|Pago]]s asociados y detiene la generación de futuras [[🏠 Entidades/factura.md|Factura]]s (ver [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06]] y [[📄 CasosDeUso/CU05_gestionar_contratos.md|CU05]]).
3.  La cuenta de usuario asociada (Entidad Usuario con el mismo `user_id`) **debe** ser marcada como desactivada (`is_active` a falso) si el rol de inquilino es el único rol activo que le queda. Si tiene otros roles activos, la cuenta de usuario puede permanecer activa, pero el rol 'inquilino' debe ser removido lógicamente de la lista de roles activos del usuario. (Nota: Esta lógica es similar a la del Propietario y se coordina con US49).

**Nota:** El sistema **no debe permitir** marcar un registro de inquilino con `deleted_at` si la transacción de desactivación no puede completarse exitosamente o dejaría datos inconsistentes.

---

### Validaciones Clave

- `user_id` debe ser una clave foránea válida que referencia a una [[🏠 Entidades/usuario.md|Entidad Usuario]] existente.
- `user_id` debe ser único en esta tabla (un usuario solo puede tener un registro como inquilino).
- El `user_id` asociado debe tener el rol 'inquilino' asignado en la [[🏠 Entidades/usuario.md|Entidad Usuario]].

---

### Relaciones

Un registro en la Entidad Inquilino (identificado por `user_id`):

- Corresponde a una [[🏠 Entidades/usuario.md|Entidad Usuario]] con el mismo `user_id` que tiene el rol 'inquilino' (relación uno a uno). **Accede a los datos generales del usuario a través de esta relación (nombre, email, teléfono, dirección, RFC).**
- Está asociado a uno o más [[🏠 Entidades/contrato.md|contrato]]s como arrendatario (relación uno a muchos, referenciando el `user_id` del inquilino en el contrato).
- Está indirectamente asociado a las [[🏠 Entidades/propiedad.md|propiedad]]es a través de sus contratos.

---

### 🔁 Casos de Uso Relacionados

- [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]] (gestiona usuarios con rol inquilino - enfoque administrativo)
- [[📄 CasosDeUso/CU05_gestionar_contratos.md]] (al crear/gestionar contratos de inquilino)
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]] (inquilino es receptor de factura)
- [[📄 CasosDeUso/CU07_notificaciones_email.md]] (inquilino recibe notificaciones)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (acciones sobre inquilino se loguean)
- [[📄 CasosDeUso/CU01_usuarios_y_accesos.md]] (gestión de la cuenta de usuario asociada y sus datos generales)

---

### 🧑‍💻 User Stories Relacionadas


### 👥 Roles Relacionados

- [[👥 Usuarios/admin.md]] (Gestiona esta entidad)
- [[👥 Usuarios/propietario.md]] (Dueño de la propiedad alquilada)
- [[👥 Usuarios/inquilino.md]] (El concepto de rol asociado a la Entidad Usuario)

### 🏠 Entidades Relacionadas

- [[🏠 Entidades/usuario.md|Entidad Usuario]] (La cuenta de acceso y fuente de datos generales)
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]
- [[🏠 Entidades/pago.md]]
- [[🏠 Entidades/propiedad.md]] (Indirectamente, a través de contratos)
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/evento.md]]
