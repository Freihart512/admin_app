## Entidad: Propietario

Representa a una persona o entidad propietaria de una o más propiedades gestionadas por el sistema. Un registro en esta entidad existe para cada [[🏠 Entidades/usuario.md|Entidad Usuario]] que tiene el rol de 'propietario'.

### Propiedades del Sistema

- `user_id` (Identificador Único / Primary Key / Clave Foránea): El identificador único del [[🏠 Entidades/usuario.md|Entidad Usuario]] asociado. Este <CODE_BLOCK>user_id</CODE_BLOCK> sirve como clave principal para esta entidad y como enlace directo a la cuenta de usuario correspondiente.
- `full_name`: El nombre completo o razón social del propietario(s).
- `rfc` (String): El Registro Federal de Contribuyentes (RFC) del propietario. Este dato es crucial para la generación de facturas y debe ser único en el sistema.
- `phone_number` (String, Opcional): Un número de contacto del propietario.
- `address` (String, Opcional): Dirección física del propietario.
- `status`: El estado actual del propietario en el sistema (e.g., 'activo', 'inactivo'). La desactivación lógica debe gestionarse a través del campo <CODE_BLOCK>deleted_at</CODE_BLOCK>.
- `created_at` (Marca de Tiempo): La fecha y hora en que se creó el registro del propietario.
- `updated_at` (Marca de Tiempo, Opcional): La fecha y hora en que se actualizó por última vez el registro del propietario.
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se marcó el registro del propietario como eliminado lógicamente (soft delete). Cuando la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada es marcada con <CODE_BLOCK>deleted_at</CODE_BLOCK> y tiene el rol 'propietario', este registro de propietario también debe ser marcado con <CODE_BLOCK>deleted_at</CODE_BLOCK> como parte de la transacción.

### Ciclo de Vida Típico

Un registro de propietario es creado típicamente por un administrador (ver [[📄 CasosDeUso/CU01_gestionar_propietarios.md|CU01]]) al registrar un nuevo usuario con el rol 'propietario' o al añadir el rol 'propietario' a un usuario existente. Puede ser editado o marcado como inactivo por un administrador (ver [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md|US02]]). La creación de un propietario (vinculado a un nuevo usuario con rol 'propietario') puede desencadenar una notificación de bienvenida (ver [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario|US27]]).

**Nota sobre Edición de RFC:** El campo <CODE_BLOCK>rfc</CODE_BLOCK> solo puede ser editado por un administrador del sistema (ver [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md|US02]]). Un cambio en el <CODE_BLOCK>rfc</CODE_BLOCK> solo afectará a las facturas que se generen **futurament**e para los pagos de los contratos de este propietario. No se actualizarán las facturas previamente emitidas. Al realizarse una actualización exitosa del <CODE_BLOCK>rfc</CODE> , el sistema debe generar un <CODE_BLOCK>Evento</CODE_BLOCK> de tipo 'Datos Fiscales del Propietario Actualizados' asociado a este propietario (identificado por <CODE_BLOCK>user_id</CODE_BLOCK>) que, a su vez, debe desencadenar una <CODE_BLOCK>Notificacion</CODE_BLOCK> para informar al usuario correspondiente sobre este cambio (ver [[📄 CasosDeUso/CU07_notificaciones_email|CU07: Notificaciones Email]] y [[🏠 Entidades/evento.md|Entidad Evento]]).

### Impacto de la Desactivación Lógica

Cuando un registro de propietario es marcado con <CODE_BLOCK>deleted_at</CODE_BLOCK> (generalmente como parte de la desactivación lógica de la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada que tiene el rol 'propietario'), este proceso debe ser una **transacción a nivel técnico** para garantizar la consistencia. La operación de desactivación desencadena las siguientes acciones de forma atómica:

1.  El registro del propietario se marca como eliminado lógicamente.
2.  Todos los <CODE_BLOCK>Contrato</CODE_BLOCK>s asociados a las propiedades de este propietario (identificado por <CODE_BLOCK>user_id</CODE_BLOCK>) que tengan <CODE_BLOCK>status: \'activo\'</CODE_BLOCK> deben cambiar su estado a <CODE_BLOCK>\'cancelado\'</CODE_BLOCK> (ver [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md|US39]]). Esto implica la cancelación de los futuros <CODE_BLOCK>Pago</CODE_BLOCK>s asociados y detiene la generación de futuras <CODE_BLOCK>Factura</CODE_BLOCK>s (ver [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06]]).
3.  Todas las <CODE_BLOCK>Propiedad</CODE_BLOCK>s asociadas a este propietario (identificado por <CODE_BLOCK>user_id</CODE_BLOCK>) deben ser marcadas como eliminadas lógicamente (<CODE_BLOCK>deleted_at</CODE_BLOCK> poblado).
4.  La cuenta de usuario asociada (Entidad Usuario con el mismo <CODE_BLOCK>user_id</CODE_BLOCK>) **debe** ser marcada como desactivada (<CODE_BLOCK>is_active</CODE_BLOCK> a falso) si el rol de propietario es el único rol activo que le queda. Si tiene otros roles activos, la cuenta de usuario puede permanecer activa, pero el rol 'propietario' debe ser removido lógicamente de la lista de roles activos del usuario.

**Nota:** El sistema **no debe permitir** marcar un propietario con <CODE_BLOCK>deleted_at</CODE_BLOCK> si la transacción de desactivación no puede completarse exitosamente o dejaría datos inconsistentes.

---

### Validaciones Clave

- <CODE_BLOCK>user_id</CODE_BLOCK> debe ser una clave foránea válida que referencia a una [[🏠 Entidades/usuario.md|Entidad Usuario]] existente.
- <CODE_BLOCK>user_id</CODE_BLOCK> debe ser único en esta tabla (un usuario solo puede tener un registro como propietario).
- <CODE_BLOCK>rfc</CODE_BLOCK> debe tener un formato válido y ser único en el sistema (se debe validar unicidad al registrar y editar).

---

### Relaciones

Un registro en la Entidad Propietario (identificado por <CODE_BLOCK>user_id</CODE_BLOCK>):

- Corresponde a una [[🏠 Entidades/usuario.md|Entidad Usuario]] con el mismo <CODE_BLOCK>user_id</CODE_BLOCK> que tiene el rol 'propietario' (relación uno a uno).
- Tiene una o más [[🏠 Entidades/propiedad.md|propiedad]]es (relación uno a muchos, referenciando el <CODE_BLOCK>user_id</CODE_BLOCK> del propietario en la propiedad).
- Está indirectamente asociado a los [[🏠 Entidades/contrato.md|contrato]]s creados para sus propiedades.
- Puede tener un [[👥 Usuarios/contador.md|contador]] asociado (si es una entidad separada y la relación es de Propietario a Contador, se referenciaría el <CODE_BLOCK>user_id</CODE_BLOCK> del propietario en la entidad Contador, si aplica esa dirección).

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU01_gestionar_propietarios.md]]
- [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]
- [[📄 CasosDeUso/CU04_gestionar_contadores.md]] (para asociar contador)
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]] (consume datos de propietario)
- [[📄 CasosDeUso/CU07_notificaciones_email.md]] (propietario recibe notificaciones)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (acciones sobre propietario se loguean)
- [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]] (gestión de la cuenta de usuario asociada)

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato.md]]
- [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario.md]]
- [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md]]
- [[🧑‍💻 UserStories/US03_panel_propietario.md]]
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad.md]]
- [[🧑‍💻 UserStories/US05_listar_propiedades.md]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin.md]]
- [[🧑‍💻 UserStories/US12_editar_contrato.md]]
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md]]
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente.md]]
- [[🧑‍💻 UserStories/US15_listar_facturas.md]]
- [[🧑‍💻 UserStories/US18_reporte_financiero.md]]
- [[🧑‍💻 UserStories/US19_listar_facturas_propietario.md]]
- [[🧑‍💻 UserStories/US20_listar_facturas_admin.md]]
- [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md]]
- [[🧑‍💻 UserStories/US26_cambio_contraseña.md]]
- [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario.md]]
- [[🧑‍💻 UserStories/US28_ver_historial_propiedad_admin.md]]
- [[🧑‍💻 UserStories/US29_registrar_propiedad_propietario.md]]
- [[🧑‍💻 UserStories/US30_ver_detalles_propiedad_propietario.md]]
- [[🧑‍💻 UserStories/US31_listar_inquilinos_propietario.md]]
- [[🧑‍💻 UserStories/US32_listar_contratos_admin.md]]
- [[🧑‍💻 UserStories/US34_listar_contratos_propietario.md]]
- [[🧑‍💻 UserStories/US35_ver_detalles_contrato_propietario.md]]
- [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]] (el concepto de rol asociado a la Entidad Usuario)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/usuario.md]] (la cuenta de acceso)
- [[🏠 Entidades/propiedad.md]]
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]
- [[🏠 Entidades/pago.md]]
- [[🏠 Entidades/contador.md]] (si es una entidad separada)
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/evento.md]]
