## Entidad: Inquilino

Representa a una persona que alquila una propiedad gestionada por el sistema. Un registro en esta entidad existe para cada [[🏠 Entidades/usuario.md|Entidad Usuario]] que tiene el rol de 'inquilino'.

### Propiedades del Sistema

- `user_id` (Identificador Único / Primary Key / Clave Foránea): El identificador único del [[🏠 Entidades/usuario.md|Entidad Usuario]] asociado. Este <CODE_BLOCK>user_id</CODE_BLOCK> sirve como clave principal para esta entidad y como enlace directo a la cuenta de usuario correspondiente.
- `full_name`: El nombre completo del inquilino(s).
- `rfc` (String, Opcional): El Registro Federal de Contribuyentes (RFC) del inquilino. Este dato es relevante para la generación de facturas como receptor.
- `phone_number` (String, Opcional): Un número de contacto del inquilino.
- `address` (String, Opcional): Dirección de contacto del inquilino.
- `status`: El estado actual del inquilino en el sistema (e.g., 'current tenant', 'former tenant'). La desactivación lógica debe gestionarse a través del campo <CODE_BLOCK>deleted_at</CODE_BLOCK>.
- `created_at` (Marca de Tiempo): La fecha y hora en que se creó el registro del inquilino.
- `updated_at` (Marca de Tiempo, Opcional): La fecha y hora en que se actualizó por última vez el registro del inquilino.
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se marcó el registro del inquilino como eliminado lógicamente (soft delete). Cuando la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada es marcada con <CODE_BLOCK>deleted_at</CODE_BLOCK> y tiene el rol 'inquilino', este registro de inquilino también debe ser marcado con <CODE_BLOCK>deleted_at</CODE_BLOCK> como parte de la transacción.

### Ciclo de Vida Típico

Un registro de inquilino es creado típicamente por un administrador (ver [[📄 CasosDeUso/CU03_gestionar_inquilinos.md|CU03]]) al registrar un nuevo usuario con el rol 'inquilino' o al añadir el rol 'inquilino' a un usuario existente. Puede ser editado o marcado como inactivo por un administrador. La creación de un inquilino (vinculado a un nuevo usuario con rol 'inquilino') puede desencadenar una notificación de bienvenida (ver [[🧑‍💻 UserStories/US40_enviar_notificacion_bienvenida_inquilino.md|US40]]).

### Impacto de la Eliminación Lógica

Cuando un registro de inquilino es marcado con <CODE_BLOCK>deleted_at</CODE_BLOCK> (generalmente como parte de la desactivación lógica de la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada que tiene el rol 'inquilino'), este proceso debe ser una **transacción a nivel técnico** para garantizar la consistencia. La operación de desactivación desencadena las siguientes acciones de forma atómica:

1.  El registro del inquilino se marca como eliminado lógicamente.
2.  Todos los <CODE_BLOCK>Contrato</CODE_BLOCK>s asociados a este inquilino (identificado por <CODE_BLOCK>user_id</CODE_BLOCK>) que tengan <CODE_BLOCK>status: \'activo\'</CODE_BLOCK> deben cambiar su estado a <CODE_BLOCK>\'cancelado\'</CODE_BLOCK> (ver [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13]]). Esto implica la cancelación de los futuros <CODE_BLOCK>Pago</CODE_BLOCK>s asociados y detiene la generación de futuras <CODE_BLOCK>Factura</CODE_BLOCK>s (ver [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06]]).
3.  La cuenta de usuario asociada (Entidad Usuario con el mismo <CODE_BLOCK>user_id</CODE_BLOCK>) **debe** ser marcada como desactivada (<CODE_BLOCK>is_active</CODE> a falso) si el rol de inquilino es el único rol activo que le queda. Si tiene otros roles activos, la cuenta de usuario puede permanecer activa, pero el rol 'inquilino' debe ser removido lógicamente de la lista de roles activos del usuario.

**Nota:** El sistema **no debe permitir** marcar un inquilino con <CODE_BLOCK>deleted_at</CODE_BLOCK> si la transacción de desactivación no puede completarse exitosamente o dejaría datos inconsistentes.

---

### Validaciones Clave

- <CODE_BLOCK>user_id</CODE_BLOCK> debe ser una clave foránea válida que referencia a una [[🏠 Entidades/usuario.md|Entidad Usuario]] existente.
- <CODE_BLOCK>user_id</CODE_BLOCK> debe ser único en esta tabla (un usuario solo puede tener un registro como inquilino).
- <CODE_BLOCK>rfc</CODE_BLOCK> (si aplica) debe tener un formato válido.

---

### Relaciones

Un registro en la Entidad Inquilino (identificado por <CODE_BLOCK>user_id</CODE_BLOCK>):

- Corresponde a una [[🏠 Entidades/usuario.md|Entidad Usuario]] con el mismo <CODE_BLOCK>user_id</CODE_BLOCK> que tiene el rol 'inquilino' (relación uno a uno).
- Está asociado a uno o más [[🏠 Entidades/contrato.md|contrato]]s como arrendatario (relación uno a muchos, referenciando el <CODE_BLOCK>user_id</CODE_BLOCK> del inquilino en el contrato).
- Está indirectamente asociado a las [[🏠 Entidades/propiedad.md|propiedad]]es a través de sus contratos.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]]
- [[📄 CasosDeUso/CU05_gestionar_contratos.md]] (al crear/gestionar contratos de inquilino)
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]] (inquilino es receptor de factura)
- [[📄 CasosDeUso/CU07_notificaciones_email.md]] (inquilino recibe notificaciones)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (acciones sobre inquilino se loguean)
- [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]] (gestión de la cuenta de usuario asociada)

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US07_registrar_nuevo_inquilino.md]]
- [[🧑‍💻 UserStories/US08_listar_inquilinos.md]]
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md]] (impactado por eliminación de inquilino)
- [[🧑‍💻 UserStories/US15_listar_facturas.md]] (inquilino ve sus facturas)
- [[🧑‍💻 UserStories/US16_notificacion_email.md]] (inquilino recibe notificaciones)
- [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md]] (si implica crear un usuario con rol inquilino)
- [[🧑‍💻 UserStories/US31_listar_inquilinos_propietario.md]] (propietario lista inquilinos - indirecta)
- [[🧑‍💻 UserStories/US36_listar_contratos_inquilino.md]] (inquilino lista sus contratos)
- [[🧑‍💻 UserStories/US37_ver_detalles_contrato_inquilino.md]] (inquilino ve detalles de su contrato)
- [[🧑‍💻 UserStories/US40_enviar_notificacion_bienvenida_inquilino.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]] (dueño de la propiedad alquilada)
- [[👥 Usuarios/inquilino.md]] (el concepto de rol asociado a la Entidad Usuario)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/usuario.md]] (la cuenta de acceso)
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]
- [[🏠 Entidades/pago.md]]
- [[🏠 Entidades/propiedad.md]]
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/evento.md]]
