## Entidad: Propiedad

Una ubicación física propiedad de un Propietario que puede ser rentada a un Inquilino a través de un Contrato.

---

### Propiedades del Sistema

- `property_id` (Identificador Único): Un identificador único generado por el sistema para la propiedad.
- `owner_user_id` (Clave Foránea): Una clave foránea que enlaza al <CODE_BLOCK>user_id</CODE_BLOCK> de la [[👥 Usuarios/propietario.md|Entidad Propietario]] que posee esta propiedad. Esta es la forma de asociar una propiedad a un propietario específico en el sistema.
- `address`: La dirección física completa de la propiedad (String).
- `features` (JSON, Opcional): Datos estructurados que describen las características de la propiedad, como número de habitaciones, baños, metros cuadrados, comodidades, etc.
- `status`: El estado de alquiler actual de la propiedad (ej. \'vacía\', \'rentada\'). **Este estado se actualiza automáticamente basado en la existencia y estado de los contratos asociados.**
- `created_at`: Una marca de tiempo del sistema que indica la fecha y hora exactas en que se creó el registro de la propiedad.
- `deleted_at` (Marca de Tiempo, Opcional): Una marca de tiempo del sistema que indica la fecha y hora exactas en que se eliminó lógicamente el registro de la propiedad, si aplica.
- `alias` (Texto): Un nombre opcional amigable o identificador interno asignado por el propietario o admin a la propiedad (ej. "Casa en la playa").

### Ciclo de Vida

Una propiedad se crea inicialmente en estado \'vacía\'. Puede cambiar a estado \'rentada\' cuando se asocia a un contrato activo. Al finalizar o expirar un contrato, la propiedad puede volver a estado \'vacía\' o mantener el estado \'rentada\' si se asocia a un nuevo contrato inmediatamente. Las propiedades pueden ser eliminadas lógicamente del sistema.

### Actualización del Estado de la Propiedad

*   El campo <CODE_BLOCK>status</CODE_BLOCK> de la propiedad (`rentada` o `vacía`) se actualizará automáticamente basado en la existencia y estado de los contratos asociados:
    *   Cuando se crea un [[🏠 Entidades/contrato.md|Contrato]] con estado <CODE_BLOCK>\'activo\'</CODE_BLOCK> para una propiedad, el sistema debe cambiar el <CODE_BLOCK>status</CODE_BLOCK> de la propiedad a <CODE_BLOCK>\'rentada\'</CODE_BLOCK>.
    *   Cuando el último [[🏠 Entidades/contrato.md|Contrato]] activo asociado a una propiedad cambia su estado a <CODE_BLOCK>\'finalizado\'</CODE_BLOCK> o <CODE_BLOCK>\'cancelado\'</CODE_BLOCK>, el sistema debe cambiar el <CODE_BLOCK>status</CODE_BLOCK> de la propiedad a <CODE_BLOCK>\'vacía\'</CODE_BLOCK>.

### Restricción de Eliminación Lógica

*   El sistema **no debe permitir** marcar una propiedad con <CODE_BLOCK>deleted_at</CODE_BLOCK> (eliminación lógica) si esta propiedad tiene al menos un [[🏠 Entidades/contrato.md|Contrato]] con estado <CODE_BLOCK>\'activo\'</CODE_BLOCK> asociado. Cualquier intento de eliminar una propiedad con contratos activos debe resultar en un error. **Nota:** Esta restricción aplica a eliminaciones lógicas directas. La eliminación lógica de un Propietario sí puede desencadenar la eliminación lógica de sus propiedades activas, pero esto debe gestionar la cancelación de contratos primero como parte de una transacción (ver [[👥 Usuarios/propietario.md|Entidad Propietario]] y [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md|US39]]).

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]
- [[📄 CasosDeUso/CU01_gestionar_propietarios.md]] (La gestión del propietario afecta a sus propiedades)
- [[📄 CasosDeUso/CU05_gestionar_contratos.md]] (La gestión de contratos afecta el estado de la propiedad)
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]] (Se relaciona con propiedades a través de contratos)
- [[📄 CasosDeUso/CU08_resumen_historial.md]] (Historial puede incluir propiedades)
- [[📄 CasosDeUso/CU10_logs_y_errores.md]] (Acciones sobre propiedades se loguean)

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US03_panel_propietario.md]] (Propietario ve sus propiedades)
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad.md]] (Admin registra propiedad)
- [[🧑‍💻 UserStories/US05_listar_propiedades.md]] (Propietario lista sus propiedades)
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin.md]] (Admin busca/lista propiedades)
- [[🧑‍💻 UserStories/US11_registrar_nuevo_contrato.md]] (Contrato se asocia a propiedad)
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente.md]] (Facturas relacionadas a propiedades vía contratos)
- [[🧑‍💻 UserStories/US15_listar_facturas.md]] (Facturas relacionadas a propiedades vía contratos)
- [[🧑‍💻 UserStories/US18_reporte_financiero.md]] (Reporte puede basarse en propiedades)
- [[🧑‍💻 UserStories/US20_listar_facturas_admin.md]] (Admin ve facturas relacionadas a propiedades)
- [[🧑‍💻 UserStories/US28_ver_historial_propiedad_admin.md]] (Admin ve historial de propiedad)
- [[🧑‍💻 UserStories/US29_registrar_propiedad_propietario.md]] (Propietario registra propiedad)
- [[🧑‍💻 UserStories/US30_ver_detalles_propiedad_propietario.md]] (Propietario ve detalles de propiedad)
- [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]] (Desactivación de propietario afecta propiedades)

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]] (Asociado vía contrato)
- [[👥 Usuarios/admin.md]] (Gestión y auditoría)

### 🏠 Entidades Relacionadas
- [[👥 Usuarios/propietario.md|Entidad Propietario]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]] (Base para el propietario)
- [[🏠 Entidades/contrato.md]]
- [[🏠 Entidades/factura.md]]
- [[🏠 Entidades/pago.md]]
- [[👥 Usuarios/inquilino.md|Entidad Inquilino]] (Asociado vía contrato)
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/evento.md]]
