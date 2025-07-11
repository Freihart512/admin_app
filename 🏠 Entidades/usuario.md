## Entidad: Usuario

Representa un usuario del sistema con credenciales de acceso y uno o más roles asignados (Admin, Propietario, Inquilino, Contador). Sirve como base para la autenticación y autorización dentro de la plataforma.

### Propiedades del Sistema

- `user_id` (Identificador Único): Un identificador único generado por el sistema para el usuario.
- `password_hash`: El hash seguro de la contraseña del usuario.
- `roles`: **Lista de roles** asignados al usuario (e.g., ['propietario', 'inquilino'], ['admin']). **Nota:** Un usuario con el rol 'admin' no puede tener ningún otro rol asignado simultáneamente.
- `email`: Dirección de correo electrónico del usuario, utilizada para notificaciones, inicio de sesión y posiblemente recuperación de contraseña. Debe tener un formato válido y ser único.
- **`name` (String): Nombre(s) del usuario. Campo obligatorio.**
- **`last_name` (String): Apellido(s) del usuario. Campo obligatorio.**
- **`phone_number` (String, Opcional): Un número de contacto del usuario. Este campo es obligatorio para usuarios con el rol 'Propietario' o 'Inquilino'.**
- **`address` (String, Opcional): Dirección física del usuario. Este campo es obligatorio para usuarios con el rol 'Propietario' o 'Inquilino'.**
- `rfc` (String, Opcional): El Registro Federal de Contribuyentes (RFC) del usuario. Este campo es obligatorio para usuarios con el rol 'Propietario' o 'Inquilino'. Debe tener un formato válido y ser único a nivel global entre todos los usuarios con RFC definido.
- `is_active`: Un indicador booleano para determinar si la cuenta del usuario está activa.
- `last_login_at` (Marca de Tiempo, Opcional): Marca de tiempo del último inicio de sesión del usuario.
- `created_at`: Marca de tiempo de cuándo se creó el registro del usuario.
- `updated_at`: Marca de Tiempo de cuándo se actualizó por última vez el registro del usuario.
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se marcó el registro del usuario como eliminado lógicamente (soft delete).

### Ciclo de Vida Típico

Un usuario es creado por un administrador o a través de un proceso de registro (ver [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md|US25]]). Puede iniciar sesión usando su email y contraseña (ver [[🧑‍💻 UserStories/US46_inicio_de_sesion.md|US46]]), cambiar su contraseña (ver [[🧑‍💻 UserStories/US26_cambio_contraseña.md|US26]]) o recuperarla (ver [[🧑‍💻 UserStories/US47_recuperacion_contrasena.md|US47]]). Los administradores pueden asignar/modificar roles (ver [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md|US45]]), editar su perfil (ver [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md|US48]]) y desactivar/activar la cuenta (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]]). Al crearse un usuario con el rol 'Propietario' (ver [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario.md|US01]]), se desencadena el envío de una notificación de bienvenida (ver [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario.md|US27]]).

### Impacto de la Eliminación Lógica

Cuando una entidad `Usuario` es marcada con `deleted_at` (eliminación lógica/desactivación general), este proceso debe ser una **transacción a nivel técnico**. La operación de desactivación/eliminación lógica del `Usuario` desencadena la eliminación lógica de sus entidades de negocio asociadas (si existen) y los procesos en cascada correspondientes a cada rol:

1.  **Si el Usuario tiene el rol 'Propietario' (y el registro de entidad Propietario existe):** El registro asociado en la [[👥 Usuarios/propietario.md|Entidad Propietario]] (identificado por el mismo `user_id`) debe ser marcado con `deleted_at` como parte de la misma transacción. Esto, a su vez, desencadena la cancelación de contratos activos y la desactivación lógica de propiedades asociadas a ese propietario, según lo definido en la entidad [[👥 Usuarios/propietario.md|Propietario]] y [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md|US39]].
2.  **Si el Usuario tiene el rol 'Inquilino' (y el registro de entidad Inquilino existe):** El registro asociado en la [[👥 Usuarios/inquilino.md|Entidad Inquilino]] (identificado por el mismo `user_id`) debe ser marcado con `deleted_at` como parte de la misma transacción. Esto, a su vez, desencadena la cancelación de contratos activos asociados a ese inquilino, según lo definido en la entidad [[👥 Usuarios/inquilino.md|Inquilino]].
3.  **Si el Usuario tiene el rol 'Contador' (y el registro de entidad Contador existe):** El registro asociado en la [[👥 Usuarios/contador.md|Entidad Contador]] (identificado por el mismo `user_id`) debe ser marcado con `deleted_at` como parte de la misma transacción. Esto, a su vez, implica eliminar la asociación con cualquier propietario al que estuviera vinculado, según lo definido en la entidad [[👥 Usuarios/contador.md|Contador]].
4.  **Si el Usuario tiene el rol 'Admin':** El registro de usuario simplemente se marca como eliminado lógicamente (`deleted_at` poblado y `is_active` a falso). Sus acciones previas registradas en el Log deben permanecer asociadas a su `user_id`.

**Nota General sobre Eliminación Lógica:** El sistema **no debe permitir** marcar un `Usuario` con `deleted_at` si la transacción de eliminación lógica en cascada no puede completarse exitosamente para todos sus roles asociados o dejaría datos inconsistentes en el sistema.

---

### Validaciones Clave

- `user_id` debe ser único (generado por el sistema).
- `email` debe tener un formato válido y ser único.
- `name` es obligatorio.
- `last_name` es obligatorio.
- **`phone_number` debe tener un formato válido y ser obligatorio para usuarios con el rol 'Propietario' o 'Inquilino'. Es opcional para usuarios con el rol 'Administrador' o 'Contador'.**
- **`address` debe ser obligatorio para usuarios con el rol 'Propietario' o 'Inquilino'. Es opcional para usuarios con el rol 'Administrador' o 'Contador'.**
- `rfc` debe tener un formato válido y ser único a nivel global entre todos los usuarios con RFC definido. Este campo es obligatorio para usuarios con el rol 'Propietario' o 'Inquilino'.
- `roles` debe ser una lista válida de roles predefinidos. La lista de roles no puede contener 'admin' y otros roles simultáneamente. Un usuario debe tener al menos un rol asignado.
- `associated_entity_id` (Nota: Este campo no parece tener sentido en un modelo de múltiples roles. Considerar eliminarlo si no tiene otro propósito claro).

---

### Relaciones por Rol

Las relaciones de la entidad `Usuario` con otras entidades dependen de los `roles` asignados. Un usuario puede tener múltiples de estas relaciones si tiene múltiples roles:

- **Admin:**
    - Puede gestionar la mayoría de las [[🏠 Entidades/entidades]].
    - Puede ser el `Usuario` registrado en un [[🏠 Entidades/log.md|Log]] por acciones de administración.
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] de alerta del sistema (ej. fallo de timbrado de [[🏠 Entidades/factura.md|factura]] o validación de RFC).

- **Propietario:**
    - Está asociado a un registro en la [[👥 Usuarios/propietario.md|Entidad Propietario]] (relación uno a uno, `user_id` es PK en Propietario si se sigue esa estructura).
    - Tiene una o más [[🏠 Entidades/propiedad.md|propiedad]]es (relación uno a muchos, a través de la Entidad Propietario).
    - Está asociado a los [[🏠 Entidades/contrato.md|contrato]]s creados para sus propiedades (a través de la Entidad Propietario y Propiedad).
    - Puede tener un [[👥 Usuarios/contador.md|contador]] asociado para fines fiscales (a través de la Entidad Propietario).
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] relacionadas con sus propiedades, contratos, facturas y pagos.
    - Puede ver [[🏠 Entidades/factura.md|factura]]s y [[🏠 Entidades/pago.md|pago]]s relacionados con sus propiedades/contratos.

- **Inquilino:**
    - Está asociado a un registro en la [[👥 Usuarios/inquilino.md|Entidad Inquilino]] (relación uno a uno, `user_id` es PK en Inquilino si se sigue la misma estructura que Propietario).
    - Está asociado a [[🏠 Entidades/contrato.md|contrato]]s como arrendatario.
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] relacionadas con sus contratos y pagos.
    - Puede ver [[🏠 Entidades/factura.md|factura]]s y [[🏠 Entidades/pago.md|pago]]s relacionados con sus contratos.

- **Contador:**
    - Está asociado a un registro en la [[👥 Usuarios/contador.md|Entidad Contador]] (relación uno a uno, `user_id` es PK en Contador si se sigue la misma estructura).
    - Puede estar asociado a **uno o más** [[👥 Usuarios/propietario.md|propietario]]s para recibir notificaciones fiscales (a través de la Entidad Contador y Propietario).
    - Recibe [[🏠 Entidades/notificacion.md|notificación]] relacionadas con las [[🏠 Entidades/factura.md|factura.md]]s de los propietarios a los que está asociado.

---

### 🔁 Casos de Uso Relacionados

- [[📄 CasosDeUso/CU01_gestionar_propietarios.md]] (gestiona usuarios con rol propietario)
- [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]] (gestiona usuarios con rol inquilino)
- [[📄 CasosDeUso/CU04_gestionar_contadores.md]] (gestiona usuarios con rol contador)
- [[📄 CasosDeUso/CU01_usuarios_y_accesos.md]] (gestión general de usuarios, roles y credenciales - ¡Auto-referencia!)
- [[📄 CasosDeUso/CU07_notificaciones_email.md]] (usuario recibe notificaciones)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (acciones de usuario se loguean)

---

### 🧑‍💻 User Stories Relacionadas

- [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md]] (Creación de usuario base - validar name, last\_name obligatorio, phone\_number y address condicional)
- [[🧑‍💻 UserStories/US46_inicio_de_sesion.md]] (Autenticación por email/contraseña)
- [[🧑‍💻 UserStories/US26_cambio_contraseña.md]] (Gestión de credenciales)
- [[🧑‍💻 UserStories/US47_recuperacion_contrasena.md]] (Gestión de credenciales)
- [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md]] (Asignación de roles - validar phone\_number, address, RFC condicionalmente al asignar roles)
- [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md]] (Edición de perfil - incluye RFC, name, last\_name, phone\_number, address - validar name, last\_name obligatorio, phone\_number y address condicional)
- [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md]] (Desactivación/Activación general transaccional)
- [[🧑‍💻 UserStories/US50_listar_usuarios_admin.md]] (Visualización por admin - mostrar name, last\_name, email, phone\_number, address, RFC)
- [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario.md]] (Caso específico de registro con rol Propietario - usa US25 y US45, validar name, last\_name, phone\_number, address, RFC)
- [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md]] (Gestionar rol Propietario - usa US49 y US48/nueva US de edición RFC si aplica - ya no edita phone/address/name/lastname)
- [[🧑‍💻 UserStories/US07_registrar_nuevo_inquilino.md]] (Caso específico de registro con rol Inquilino - usará US25 y US45, validar name, last\_name, phone\_number, address, RFC)
- [[🧑‍💻 UserStories/US09_registrar_nuevo_contador.md]] (Caso específico de registro con rol Contador - usará US25 y US45, validar name, last\_name)
- [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario.md]] (Notificación para Propietario - desencadenada por US01/US45)
- [[🧑‍💻 UserStories/US36_listar_contratos_inquilino.md]] (Usuario con rol Inquilino visualiza sus contratos - mostrar datos de usuario, ej. name, last\_name, phone, address)
- [[🧑‍💻 UserStories/US37_ver_detalles_contrato_inquilino.md]] (Usuario con rol Inquilino visualiza sus contratos - mostrar datos de usuario)
- [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]] (Lógica específica del rol Propietario en desactivación - llamada por US49)
- (Añadir aquí otras US donde el usuario interactúe, como las de visualización de Propietario - US03, US29, US30, US31, US34, US35 - mostrar datos de usuario, ej. name, last\_name, phone, address)

---

### 👥 Roles Relacionados

- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/contador.md]]

---

### 🏠 Entidades Relacionadas (Referenciadas por los roles)

- [[👥 Usuarios/propietario.md|Entidad Propietario]] (Información específica del rol Propietario)
- [[👥 Usuarios/inquilino.md|Entidad Inquilino]] (Información específica del rol Inquilino)
- [[👥 Usuarios/contador.md|Entidad Contador]] (Información específica del rol Contador)
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/propiedad.md]]
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]
- [[🏠 Entidades/pago.md]]
