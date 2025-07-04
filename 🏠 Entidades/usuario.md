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
Al crearse un usuario con rol 'Propietario', se desencadena el envío de una notificación de bienvenida (ver [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario]]).
### Impacto de la Eliminación Lógica por Rol

- **Propietario:** Si un `Usuario` con `role: 'Propietario'` es marcado con `deleted_at`, todos los `Contratos` asociados a las propiedades de ese propietario que tengan `status: 'activo'` deben cambiar su estado a `'cancelado'`. Esto implica la cancelación de los futuros `Pago` asociados a esos contratos y, por ende, la detención de la generación de futuras `Factura` para esos pagos. **Además, todas las `Propiedad` asociadas a este propietario deben ser marcadas como eliminadas lógicamente (`deleted_at` poblado).**
- **Inquilino:** (Especificar impacto en contratos, pagos, facturas activas si un inquilino es eliminado lógicamente. Probablemente similar a propietario para sus contratos.)
- **Contador:** (Especificar impacto en la asociación con propietarios y recepción de notificaciones si un contador es eliminado lógicamente.)
- **Admin:** (Especificar impacto si un admin es eliminado lógicamente. Probablemente solo desactiva la cuenta.)

**Nota:** El sistema **no debe permitir** marcar un `Usuario` con `deleted_at` si su eliminación tendría un impacto que el sistema no puede manejar automáticamente o que dejaría datos inconsistentes (ej. un inquilino con contratos activos que no se pueden cancelar). Las reglas específicas para inquilinos y contadores deben definirse para evitar inconsistencias. Para V1.0, puede ser una restricción simple de \"no eliminar si tiene relaciones activas importantes\" hasta definir las lógicas cascada.

---

### Validaciones Clave

- `username` debe ser único.
- `email` debe tener un formato válido y ser único (opcionalmente).
- `role` debe ser uno de los roles predefinidos.
- `associated_entity_id` debe hacer referencia a una entidad existente del tipo correcto según el `role`.

---

### Relaciones por Rol

Las relaciones de la entidad `Usuario` con otras entidades dependen del `role` asignado:

- **Admin:**
    - Puede gestionar la mayoría de las [[🏠 Entidades/entidades]].
    - Puede ser el [[🏠 Entidades/usuario]] registrado en un [[🏠 Entidades/log]] por acciones de administración.
    - Recibe [[🏠 Entidades/notificacion]] de alerta del sistema (ej. fallo de timbrado de [[🏠 Entidades/factura]] ).

- **Propietario:**
    - Tiene una o más [[🏠 Entidades/propiedad|propiedad]] (relación uno a muchos).
    - Está asociado a los [[🏠 Entidades/contrato|contrato]] creados para sus propiedades (relación indirecta a través de [[🏠 Entidades/propiedad|propiedad]] ).
    - Puede tener un [[👥 Usuarios/contador]] asociado para fines fiscales (relación uno a uno).
    - Recibe [[🏠 Entidades/notificacion|notificación]] relacionadas con sus propiedades y contratos (ej. [[🏠 Entidades/factura|factura]] generada, [[🏠 Entidades/pago|pago]] vencido).\n    - Puede ver [[🏠 Entidades/factura]] y [[🏠 Entidades/pago]] relacionados con sus propiedades/contratos.\n\n- **Inquilino:**\n    - Está asociado a uno o más [[🏠 Entidades/contrato|contrato]] (relación uno a muchos, aunque V1.0 limita a un inquilino por contrato).\n    - Es el sujeto principal de los [[🏠 Entidades/pago|pago]] definidos en sus contratos.\n    - Es el destinatario de las [[🏠 Entidades/factura|factura]] generadas a partir de sus pagos.\n    - Recibe [[🏠 Entidades/notificacion|notificación]] relacionadas con sus contratos, pagos y facturas.\n\n- **Contador:**\n    - Puede estar asociado a uno o más [[👥 Usuarios/propietario]] para recibir notificaciones fiscales (relación uno a muchos, aunque en V1.0 se implementará como uno a uno: un propietario puede tener un contador).\n    - Recibe [[🏠 Entidades/notificacion|notificación]] relacionadas con las [[🏠 Entidades/factura|factura]] de los propietarios a los que está asociado.\n\n### 🔁 Casos de Uso Relacionados\n- [[📄 CasosDeUso/CU01_gestionar_propietarios|CU01_gestionar_propietarios]]\n- [[📄 CasosDeUso/CU03_gestionar_inquilinos|CU03_gestionar_inquilinos]]\n- [[📄 CasosDeUso/CU04_gestionar_contadores|CU04_gestionar_contadores]]\n- [[📄 CasosDeUso/CU11_usuarios_y_accesos|CU11_usuarios_y_accesos]]\n\n### 🧑‍💻 User Stories Relacionadas\n- [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario]]\n- [[🧑‍💻 UserStories/US07_CU03_gestionar_inquilinos]]\n- [[🧑‍💻 UserStories/US09_CU04_gestionar_contadores]]\n- [[🧑‍💻 UserStories/US25_CU11_gestionar_accesos_y_credenciales]]\n- [[🧑‍💻 UserStories/US26_CU11_gestionar_accesos_y_credenciales]]\n\n### 👥 Roles Relacionados\n- [[👥 Usuarios/admin]]\n- [[👥 Usuarios/propietario]]\n- [[👥 Usuarios/inquilino]]\n- [[👥 Usuarios/contador]]\n\n### 🏠 Entidades Relacionadas\n- [[🏠 Entidades/propiedad]]\n- [[🏠 Entidades/contrato]]\n- [[🏠 Entidades/factura]]\n- [[🏠 Entidades/pago]]\n- [[🏠 Entidades/notificacion]]\n- [[🏠 Entidades/log]]\n
