## Entidad: Usuario

Representa un usuario del sistema con credenciales de acceso y uno o más roles asignados (Admin, Propietario, Inquilino, Contador). Sirve como base para la autenticación y autorización dentro de la plataforma.

### Propiedades del Sistema

- `user_id` (Identificador Único): Un identificador único generado por el sistema para el usuario.
- `username`: Nombre de usuario único utilizado para el inicio de sesión.
- `password_hash`: El hash seguro de la contraseña del usuario.
- `roles`: **Lista de roles** asignados al usuario (e.g., ['propietario', 'inquilino'], ['admin']). **Nota:** Un usuario con el rol 'admin' no puede tener ningún otro rol asignado simultáneamente.
- `email`: Dirección de correo electrónico del usuario, utilizada para notificaciones y posiblemente recuperación de contraseña.
- `is_active`: Un indicador booleano para determinar si la cuenta del usuario está activa.
- `last_login_at` (Marca de Tiempo, Opcional): Marca de tiempo del último inicio de sesión del usuario.
- `created_at`: Marca de tiempo de cuándo se creó el registro del usuario.
- `updated_at`: Marca de Tiempo de cuándo se actualizó por última vez el registro del usuario.
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se marcó el registro del usuario como eliminado lógicamente (soft delete).

### Ciclo de Vida Típico

Un usuario es creado por un administrador o a través de un proceso de registro (si aplica en futuras versiones). Puede ser activado/desactivado por un administrador. Los usuarios pueden actualizar sus propios datos de acceso. Al crearse un usuario con el rol \'Propietario\', se desencadena el envío de una notificación de bienvenida (ver [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario]]).

### Impacto de la Eliminación Lógica

Cuando una entidad <CODE_BLOCK>Usuario</CODE_BLOCK> es marcada con <CODE_BLOCK>deleted_at</CODE_BLOCK> (eliminación lógica), este proceso debe ser una **transacción a nivel técnico**. La operación de desactivación/eliminación lógica del <CODE_BLOCK>Usuario</CODE_BLOCK> desencadena la eliminación lógica de sus entidades de negocio asociadas (si existen) y los procesos en cascada correspondientes a cada rol:

1.  **Si el Usuario tiene el rol 'Propietario':** El registro asociado en la [[👥 Usuarios/propietario.md|Entidad Propietario]] (identificado por el mismo <CODE_BLOCK>user_id</CODE_BLOCK>) debe ser marcado con <CODE_BLOCK>deleted_at</CODE_BLOCK>. Esto, a su vez, desencadena la cancelación de contratos activos y la desactivación lógica de propiedades asociadas a ese propietario, según lo definido en la entidad [[👥 Usuarios/propietario.md|Propietario]] y [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md|US39]].
2.  **Si el Usuario tiene el rol 'Inquilino':** El registro asociado en la [[👥 Usuarios/inquilino.md|Entidad Inquilino]] (identificado por el mismo <CODE_BLOCK>user_id</CODE_BLOCK>) debe ser marcado con <CODE_BLOCK>deleted_at</CODE_BLOCK>. Esto, a su vez, desencadena la cancelación de contratos activos asociados a ese inquilino, según lo definido en la entidad [[👥 Usuarios/inquilino.md|Inquilino]].
3.  **Si el Usuario tiene el rol 'Contador':** El registro asociado en la [[👥 Usuarios/contador.md|Entidad Contador]] (identificado por el mismo <CODE_BLOCK>user_id</CODE_BLOCK>) debe ser marcado con <CODE_BLOCK>deleted_at</CODE_BLOCK>. Esto, a su vez, implica eliminar la asociación con cualquier propietario al que estuviera vinculado, según lo definido en la entidad [[👥 Usuarios/contador.md|Contador]].
4.  **Si el Usuario tiene el rol 'Admin':** El registro de usuario simplemente se marca como eliminado lógicamente (<CODE_BLOCK>deleted_at</CODE> poblado y <CODE_BLOCK>is_active</CODE> a falso). Sus acciones previas registradas en el Log deben permanecer asociadas a su <CODE_BLOCK>user_id</CODE>`.

**Nota General sobre Eliminación Lógica:** El sistema **no debe permitir** marcar un <CODE_BLOCK>Usuario</CODE_BLOCK> con <CODE_BLOCK>deleted_at</CODE_BLOCK> si la transacción de eliminación lógica en cascada no puede completarse exitosamente para todos sus roles asociados o dejaría datos inconsistentes en el sistema.

---

### Validaciones Clave

- <CODE_BLOCK>user_id</CODE_BLOCK> debe ser único (generado por el sistema).
- <CODE_BLOCK>username</CODE_BLOCK> debe ser único.
- <CODE_BLOCK>email</CODE_BLOCK> debe tener un formato válido y ser único (opcionalmente).
- <CODE_BLOCK>roles</CODE_BLOCK> debe ser una lista válida de roles predefinidos. La lista de roles no puede contener 'admin' y otros roles simultáneamente.
- <CODE_BLOCK>associated_entity_id</CODE_BLOCK> (si se mantiene y su propósito se redefine con roles múltiples, de lo contrario, considerar su eliminación).

---

### Relaciones por Rol

Las relaciones de la entidad <CODE_BLOCK>Usuario</CODE_BLOCK> con otras entidades dependen de los <CODE_BLOCK>roles</CODE_BLOCK> asignados. Un usuario puede tener múltiples de estas relaciones si tiene múltiples roles:

- **Admin:**
    - Puede gestionar la mayoría de las [[🏠 Entidades/entidades]].
    - Puede ser el <CODE_BLOCK>Usuario</CODE_BLOCK> registrado en un [[🏠 Entidades/log.md|Log]] por acciones de administración.
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] de alerta del sistema (ej. fallo de timbrado de [[🏠 Entidades/factura.md|factura]]).

- **Propietario:**
    - Está asociado a un registro en la [[👥 Usuarios/propietario.md|Entidad Propietario]] (relación uno a uno, <CODE_BLOCK>user_id</CODE_BLOCK> es PK en Propietario).
    - Tiene una o más [[🏠 Entidades/propiedad.md|propiedad]]es (relación uno a muchos, a través de la Entidad Propietario).
    - Está asociado a los [[🏠 Entidades/contrato.md|contrato]]s creados para sus propiedades (a través de la Entidad Propietario y Propiedad).
    - Puede tener un [[👥 Usuarios/contador.md|contador]] asociado para fines fiscales (a través de la Entidad Propietario).
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] relacionadas con sus propiedades, contratos, facturas y pagos.
    - Puede ver [[🏠 Entidades/factura.md|factura]]s y [[🏠 Entidades/pago.md|pago]]s relacionados con sus propiedades/contratos.

- **Inquilino:**
    - Está asociado a un registro en la [[👥 Usuarios/inquilino.md|Entidad Inquilino]] (relación uno a uno, <CODE_BLOCK>user_id</CODE_BLOCK> es PK en Inquilino si se sigue la misma estructura que Propietario).
    - Está asociado a [[🏠 Entidades/contrato.md|contrato]]s como arrendatario.
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] relacionadas con sus contratos y pagos.
    - Puede ver [[🏠 Entidades/factura.md|factura]]s y [[🏠 Entidades/pago.md|pago]]s relacionados con sus contratos.

- **Contador:**
    - Está asociado a un registro en la [[👥 Usuarios/contador.md|Entidad Contador]] (relación uno a uno, <CODE_BLOCK>user_id</CODE_BLOCK> es PK en Contador si se sigue la misma estructura).
    - Puede estar asociado a **uno o más** [[👥 Usuarios/propietario.md|propietario]]s para recibir notificaciones fiscales (a través de la Entidad Contador y Propietario).
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] relacionadas con las [[🏠 Entidades/factura.md|factura]]s de los propietarios a los que está asociado.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU01_gestionar_propietarios.md]] (gestiona usuarios con rol propietario)
- [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]] (gestiona usuarios con rol inquilino)
- [[📄 CasosDeUso/CU04_gestionar_contadores.md]] (gestiona usuarios con rol contador)
- [[📄 CasosDeUso/CU11_usuarios_y_accesos.md]] (gestión general de usuarios, roles y credenciales)
- [[📄 CasosDeUso/CU07_notificaciones_email.md]] (usuario recibe notificaciones)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (acciones de usuario se loguean)

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato.md]]
- [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario.md]]
- [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md]]
- [[🧑‍💻 UserStories/US03_panel_propietario.md]]
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad.md]]
- [[🧑‍💻 UserStories/US05_listar_propiedades.md]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin.md]]
- [[🧑‍💻 UserStories/US07_registrar_nuevo_inquilino.md]]
- [[🧑‍💻 UserStories/US08_listar_inquilinos.md]]
- [[🧑‍💻 UserStories/US09_registrar_nuevo_contador.md]]
- [[🧑‍💻 UserStories/US10_editar_contador.md]]
- [[🧑‍💻 UserStories/US12_editar_contrato.md]]
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md]]
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente.md]]
- [[🧑‍💻 UserStories/US15_listar_facturas.md]]
- [[🧑‍💻 UserStories/US16_notificacion_email.md]]
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
- [[🧑‍💻 UserStories/US36_listar_contratos_inquilino.md]]
- [[🧑‍💻 UserStories/US37_ver_detalles_contrato_inquilino.md]]
- [[🧑‍💻 UserStories/US38_notificacion_cancelacion_contrato]]
- [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]]
- [[🧑‍💻 UserStories/US40_enviar_notificacion_bienvenida_inquilino.md]]
- [[🧑‍💻 UserStories/US41_enviar_notificacion_bienvenida_contador.md]]
- [[🧑‍💻 UserStories/US42_notificacion_nueva_asociacion_contador.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/contador.md]]

### 🏠 Entidades Relacionadas
- [[👥 Usuarios/propietario.md|Entidad Propietario]]
- [[👥 Usuarios/inquilino.md|Entidad Inquilino]]
- [[👥 Usuarios/contador.md|Entidad Contador]]
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/propiedad.md]] (a través de las entidades de rol)
- [[🏠 Entidades/contrato.md]] (a través de las entidades de rol)
- [[🏠 Entidades/factura.md]] (a través de las entidades de rol)
- [[🏠 Entidades/pago.md]] (a través de las entidades de rol)
