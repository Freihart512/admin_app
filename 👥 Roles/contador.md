## Entidad: Contador

Representa la información y el estado específico de un usuario que tiene el rol de 'contador'. Un registro en esta entidad existe para cada [[🏠 Entidades/usuario.md|Entidad Usuario]] que tiene el rol de 'contador'. Los datos generales del contador (nombre, email, teléfono, dirección, RFC - aunque RFC no es obligatorio ni específico para este rol) residen en la [[🏠 Entidades/usuario.md|Entidad Usuario]].

### Propiedades del Sistema

- `user_id` (Identificador Único / Primary Key / Clave Foránea): El identificador único del [[🏠 Entidades/usuario.md|Entidad Usuario]] asociado. Este `user_id` sirve como clave principal para esta entidad y como enlace directo a la cuenta de usuario correspondiente, heredando de ella los datos generales como nombre, email, teléfono y dirección.
- `status`: El estado actual del registro del contador en el sistema (e.g., 'activo', 'inactivo'). Este estado se refiere al rol específico de contador y puede ser independiente del estado general de la cuenta de usuario (aunque la desactivación general del usuario debe impactar este estado).
- `created_at` (Marca de Tiempo): La fecha y hora en que se creó el registro de este rol de contador.
- `updated_at` (Marca de Tiempo, Opcional): La fecha y hora en que se actualizó por última vez el registro de este rol de contador (ej. cambio de estado, si aplica, o gestión de asociaciones con propietarios).
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se marcó el registro de este rol de contador como eliminado lógicamente (soft delete). Cuando la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada es marcada con `deleted_at` y tiene el rol 'contador', este registro de contador también debe ser marcado con `deleted_at` como parte de la transacción (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]]).
- **(Considerar añadir aquí atributos específicos del rol Contador si los hay, que no estén en la entidad Usuario y sean relevantes solo para Contadores. Por ejemplo, un número de colegiado, o información de facturación específica si es diferente a la del usuario general).**

### Ciclo de Vida Típico

Un registro de contador es creado típicamente por un administrador (ver [[📄 CasosDeUso/CU04_gestionar_contadores.md|CU04]] y [[🧑‍💻 UserStories/US09_registrar_nuevo_contador.md|US09]]) al añadir el rol 'contador' a un usuario (nuevo o existente). Puede ser marcado como inactivo (eliminación lógica) por un administrador (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]], que desencadena esta lógica). La creación de un contador (vinculado a un nuevo usuario con rol 'contador') puede desencadenar una notificación de bienvenida (ver [[🧑‍💻 UserStories/US41_enviar_notificacion_bienvenida_contador.md|US41]]). La edición de datos generales del contador (nombre, email, teléfono, dirección) se realiza a través de la gestión de la [[🏠 Entidades/usuario.md|Entidad Usuario]] (ver [[🧑‍💻 UserStories/US48_editar_perfil_usuario_general.md|US48]]). La asociación de un contador con uno o más propietarios se gestiona dentro del [[📄 CasosDeUso/CU04_gestionar_contadores.md|CU04]].

### Impacto de la Desactivación Lógica

Cuando un registro de contador es marcado con `deleted_at` (eliminación lógica de este rol), generalmente como parte de la desactivación lógica de la [[🏠 Entidades/usuario.md|Entidad Usuario]] asociada que tiene el rol 'contador' (ver [[🧑‍💻 UserStories/US49_desactivar_activar_usuario_general.md|US49]]), este proceso debe ser una **transacción a nivel técnico** para garantizar la consistencia. La operación de desactivación del rol de contador, desencadenada por la desactivación general del usuario, ejecuta las siguientes acciones de forma atómica:

1.  El registro del contador se marca como eliminado lógicamente.
2.  Se elimina la asociación de este contador con cualquier propietario al que estuviera vinculado. (Nota: La lógica exacta de "eliminar la asociación" debe estar definida, por ejemplo, marcando como eliminado lógicamente la entrada en una tabla de asociación o en la entidad Propietario si la relación es de ahí al Contador).

**Nota:** El sistema **no debe permitir** marcar un registro de contador con `deleted_at` si la transacción de desactivación no puede completarse exitosamente o dejaría datos inconsistentes.

---

### Validaciones Clave

- `user_id` debe ser una clave foránea válida que referencia a una [[🏠 Entidades/usuario.md|Entidad Usuario]] existente.
- `user_id` debe ser único en esta tabla (un usuario solo puede tener un registro como contador).
- El `user_id` asociado debe tener el rol 'contador' asignado en la [[🏠 Entidades/usuario.md|Entidad Usuario]].

---

### Relaciones

Un registro en la Entidad Contador (identificado por `user_id`):

- Corresponde a una [[🏠 Entidades/usuario.md|Entidad Usuario]] con el mismo `user_id` que tiene el rol 'contador' (relación uno a uno). **Accede a los datos generales del usuario a través de esta relación (nombre, email, teléfono, dirección).**
- Puede estar asociado a **uno o más** [[👥 Usuarios/propietario.md|propietario]]s para recibir notificaciones fiscales (relación muchos a muchos entre Contador y Propietario, o uno a muchos desde Propietario a Contador si esa es la dirección de la relación de asociación). La implementación de esta asociación debe estar documentada.

---

### 🔁 Casos de Uso Relacionados

- [[📄 CasosDeUso/CU04_gestionar_contadores.md]] (gestiona usuarios con rol contador y sus asociaciones)
- [[📄 CasosDeUso/CU07_notificaciones_email.md]] (contador recibe notificaciones)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (acciones sobre contador se loguean)
- [[📄 CasosDeUso/CU01_usuarios_y_accesos.md]] (gestión de la cuenta de usuario asociada y sus datos generales)

---

### 🧑‍💻 User Stories Relacionadas



---

### 👥 Roles Relacionados

- [[👥 Usuarios/admin.md]] (Gestiona esta entidad y sus asociaciones)
- [[👥 Usuarios/propietario.md]] (Puede estar asociado a un Contador)
- [[👥 Usuarios/contador.md]] (El concepto de rol asociado a la Entidad Usuario)

### 🏠 Entidades Relacionadas

- [[🏠 Entidades/usuario.md|Entidad Usuario]] (La cuenta de acceso y fuente de datos generales)
- [[👥 Usuarios/propietario.md|Entidad Propietario]] (Con la que se asocia)
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/factura.md]] (Acceso a facturas de propietarios asociados)
- (Añadir aquí la entidad que gestione la asociación entre Contador y Propietario, si no es la entidad Propietario directamente).
