### 🔸 CU11 - Gestionar accesos y credenciales

Este caso de uso se centra en la gestión de la [[🏠 Entidades/usuario.md|Entidad Usuario]], que es la base para el acceso y los roles en el sistema. Abarca las funcionalidades necesarias para crear, editar y desactivar lógicamente cuentas de usuario, así como para asignar y modificar los roles asociados a cada usuario.

La gestión de usuarios incluye el manejo de credenciales de acceso (username, password), la actualización de datos de contacto (email, teléfono si aplica), y el control del estado activo/inactivo de la cuenta (<CODE_BLOCK>is_active</CODE_BLOCK> y <CODE_BLOCK>deleted_at</CODE_BLOCK>). La asignación de roles (<CODE_BLOCK>roles</CODE_BLOCK>) determina las capacidades del usuario dentro del sistema.

**Nota Importante sobre Roles:** La gestión de roles debe aplicar la regla de que un usuario con el rol 'admin' no puede tener asignado ningún otro rol simultáneamente. Solo los usuarios sin el rol 'admin' pueden tener múltiples roles (propietario, inquilino, contador, o combinaciones).

- [[🧑‍💻 UserStories/US25_registro_nuevo_usuario.md|US25: Como admin, quiero crear usuarios con rol de propietario, para que accedan a su panel.]] (Esta US es un ejemplo específico de creación de usuario y asignación de rol dentro de este CU más amplio).
- [[🧑‍💻 UserStories/US26_cambio_contraseña.md|US26: Como usuario, quiero poder cambiar mi contraseña y datos de acceso, para mantener la seguridad.]] (Aplica a cualquier usuario, incluyendo Propietarios, dentro de este CU).

---

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[🏠 Entidades/log.md|Entidad Log]] (Para registrar acciones de gestión de usuarios)
- [[🏠 Entidades/notificacion.md|Entidad Notificación]] (Ej. notificaciones sobre cambios de credenciales)
