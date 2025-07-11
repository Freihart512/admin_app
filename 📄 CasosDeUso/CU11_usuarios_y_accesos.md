### 🔸 CU11 - Gestión General de Usuarios y Accesos

Este caso de uso centraliza la gestión de la [[🏠 Entidades/usuario.md|Entidad Usuario]], que es la base para la autenticación, el acceso y los roles en el sistema. Abarca las funcionalidades necesarias para:

*   **Registro** de nuevas cuentas de usuario.
*   **Autenticación** (inicio de sesión) utilizando credenciales.
*   **Gestión de Credenciales:** Cambio y recuperación de contraseña.
*   **Edición** de la información básica del perfil de usuario (con validación especial para email).
*   **Asignación y Modificación de Roles** asociados a cada usuario por parte del administrador.
*   Control del **estado activo/inactivo** de la cuenta de usuario por parte del administrador.
*   **Visualización de un listado** de usuarios para el administrador.

La gestión de usuarios implica el manejo de credenciales de acceso (email como identificador, contraseña hasheada), la actualización de datos de contacto (email, teléfono si aplica), y el control del estado activo/inactivo de la cuenta (`is_active` y `deleted_at`). La asignación de roles (`roles`) determina las capacidades del usuario dentro del sistema, adhiriéndose a reglas de negocio específicas.

**Reglas Importantes sobre Roles:**
*   Un usuario siempre debe tener al menos un rol asignado.
*   Un usuario con el rol 'admin' no puede tener asignado ningún otro rol simultáneamente.
*   Los roles Propietario, Inquilino y Contador son compatibles y pueden ser asignados a un mismo usuario simultáneamente.
*   La desactivación general de un usuario desencadena de forma transaccional la ejecución de las lógicas de desactivación específicas de cada rol asignado.

**User Stories Asociadas:**

- [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md|US25: Registro de Nuevo Usuario]]
- [[🧑‍💻 UserStories/US46_inicio_de_sesion.md|US46: Inicio de Sesión (Login)]]
- [[🧑‍💻 UserStories/US26_cambio_contraseña.md|US26: Cambio de Contraseña]]
- [[🧑‍💻 UserStories/US47_recuperacion_contrasena.md|US47: Recuperación de Contraseña]]
- [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md|US45: Asignar/Modificar Roles de Usuario (Administrador)]]
- [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md|US48: Editar Perfil de Usuario (General)]]
- [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49: Desactivar/Activar Usuario (General - por Administrador)]]
- [[🧑‍💻 UserStories/US50_listar_usuarios_admin.md|US50: Listar Usuarios (Administrador)]]

---

### 🏠 Entidades Relacionadas

- [[🏠 Entidades/Usuario.md|Entidad Usuario]]
- [[🏠 Entidades/Log.md|Entidad Log]] (Para registrar acciones de gestión de usuarios, intentos de acceso, etc.)
- [[🏠 Entidades/Notificacion.md|Entidad Notificación]] (Para procesos como recuperación de contraseña, bienvenida, verificación de email, etc.)
- [[🏠 Entidades/Evento.md]] / [[🏠 Entidades/Eventos_del_sistema.md]] (Si la gestión de usuarios o las acciones relacionadas generan eventos significativos del sistema)

---

## Relaciones

- **Entidades Principales:**
    - [[🏠 Entidades/Usuario.md]]
- **User Stories:**
    - [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md]]
    - [[🧑‍💻 UserStories/US46_inicio_de_sesion.md]]
    - [[🧑‍💻 UserStories/US26_cambio_contraseña.md]]
    - [[🧑‍💻 UserStories/US47_recuperacion_contrasena.md]]
    - [[🧑‍💻 UserStories/US45_asignar_modificar_roles_usuario.md]]
    - [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md]]
    - [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md]]
    - [[🧑‍💻 UserStories/US50_listar_usuarios_admin.md]]
- **Entidades de Registro/Comunicación:**
    - [[🏠 Entidades/Log.md]]
    - [[🏠 Entidades/Notificacion.md]]
    - [[🏠 Entidades/Evento.md]]
    - [[🏠 Entidades/Eventos_del_sistema.md]]
- **Relaciones con otros CUs/US (por desactivación transaccional):**
    - [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]]
    - (Si existen, añadir enlaces a las US/CUs para desactivar roles Inquilino y Contador)
