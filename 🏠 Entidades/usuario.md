## Entidad: Usuario

Representa un usuario del sistema con credenciales de acceso y un rol asignado (Admin, Propietario, Inquilino, Contador). Sirve como base para la autenticación y autorización dentro de la plataforma.

### Propiedades del Sistema

- `user_id` (Unique Identifier): Un identificador único generado por el sistema para el usuario.
- `username`: Nombre de usuario único utilizado para el inicio de sesión.
- `password_hash`: El hash seguro de la contraseña del usuario.
- `role`: El rol asignado al usuario (e.g., 'admin', 'propietario', 'inquilino', 'contador').
- `email`: Dirección de correo electrónico del usuario, utilizada para notificaciones y posiblemente recuperación de contraseña.
- `associated_entity_id` (Foreign Key, Optional): Un enlace opcional al ID de la entidad específica asociada con este usuario (ej. `owner_id` para un Propietario, `tenant_id` para un Inquilino, `contador_id` para un Contador).
- `is_active`: Un indicador booleano para determinar si la cuenta del usuario está activa.
- `last_login_at` (Timestamp, Optional): Marca de tiempo del último inicio de sesión del usuario.
- `created_at`: Marca de tiempo de cuándo se creó el registro del usuario.
- `updated_at`: Marca de tiempo de cuándo se actualizó por última vez el registro del usuario.
- `deleted_at` (Timestamp, Optional): Marca de tiempo de cuándo se marcó el registro del usuario como eliminado (soft delete).

### Ciclo de Vida Típico

Un usuario es creado por un administrador o a través de un proceso de registro (si aplica en futuras versiones). Puede ser activado/desactivado por un administrador. Los propietarios pueden actualizar sus propios datos de acceso.

### Validaciones Clave

- `username` debe ser único.
- `email` debe tener un formato válido y ser único (opcionalmente).
- `role` debe ser uno de los roles predefinidos.
- `associated_entity_id` debe hacer referencia a una entidad existente del tipo correcto según el `role`.

---

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU03_gestionar_inquilinos]]
- [[📄 CasosDeUso/CU04_gestionar_contadores]]
- [[📄 CasosDeUso/CU11_usuarios_y_accesos]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario]]
- [[🧑‍💻 UserStories/US07_CU03_gestionar_inquilinos]]
- [[🧑‍💻 UserStories/US09_CU04_gestionar_contadores]]
- [[🧑‍💻 UserStories/US25_CU11_gestionar_accesos_y_credenciales]]
- [[🧑‍💻 UserStories/US26_CU11_gestionar_accesos_y_credenciales]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin]]
- [[👥 Usuarios/propietario]]
- [[👥 Usuarios/inquilino]]
- [[👥 Usuarios/contador]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad]]
- [[🏠 Entidades/contrato]]
- [[🏠 Entidades/factura]]
- [[🏠 Entidades/pago]]