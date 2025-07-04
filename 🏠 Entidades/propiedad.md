## Entidad: Propiedad

Una ubicación física propiedad de un Propietario que puede ser rentada a un Inquilino a través de un Contrato.

---

### Propiedades del Sistema

- `property_id` (Identificador Único): Un identificador único generado por el sistema para la propiedad.
- `owner_id` (Clave Foránea): Una clave foránea que enlaza al identificador único del propietario que posee esta propiedad.
- `address`: La dirección física completa de la propiedad.
- `features` (JSON, Opcional): Datos estructurados que describen la propiedad, como número de habitaciones, baños, metros cuadrados, comodidades, etc.
- `status`: El estado de alquiler actual de la propiedad (ej. 'vacía', 'rentada').
- `created_at`: Una marca de tiempo del sistema que indica la fecha y hora exactas en que se creó el registro de la propiedad.
- `deleted_at` (Marca de Tiempo, Opcional): Una marca de tiempo del sistema que indica la fecha y hora exactas en que se eliminó lógicamente el registro de la propiedad, si aplica.
- `alias` (Texto): Un nombre opcional amigable o identificador interno asignado por el propietario o admin a la propiedad (ej. "Casa en la playa").


### Ciclo de Vida

Una propiedad se crea inicialmente en estado 'vacía'. Puede cambiar a estado 'rentada' cuando se asocia a un contrato activo. Al finalizar o expirar un contrato, la propiedad puede volver a estado 'vacía' o mantener el estado 'rentada' si se asocia a un nuevo contrato inmediatamente. Las propiedades pueden ser eliminadas lógicamente del sistema.

### Actualización del Estado de la Propiedad

*   El campo `status` de la propiedad (`rentada` o `vacía`) se actualizará automáticamente basado en la existencia y estado de los contratos asociados:
    *   Cuando se crea un `Contrato` con `status: \\\'activo\\\'` para una propiedad, el sistema debe cambiar el `status` de la propiedad a `\'rentada\'`.
    *   Cuando el último `Contrato` activo asociado a una propiedad cambia su estado a `\'finalizado\'` o `\'cancelado\'`, el sistema debe cambiar el `status` de la propiedad a `\'vacía\'`.

### Restricción de Eliminación Lógica

*   El sistema **no debe permitir** marcar una propiedad con `deleted_at` (eliminación lógica) si esta propiedad tiene al menos un `Contrato` con `status: \\\'activo\\\'` asociado. Cualquier intento de eliminar una propiedad con contratos activos debe resultar en un error.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU02_gestionar_propiedades]]
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU05_gestionar_contratos.md]]
- [[📄 CasosDeUso/CU06_facturacion_automatica.md]]
- [[📄 CasosDeUso/CU08_resumen_historial.md]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US03_panel_propietario.md]]
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad]]
- [[🧑‍💻 UserStories/US05_listar_propiedades]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin]]
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato]]
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente.md]]
- [[🧑‍💻 UserStories/US15_listar_facturas.md]]
- [[🧑‍💻 UserStories/US18_reporte_financiero]]
- [[🧑‍💻 UserStories/US20_listar_facturas_admin]]

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario]]
- [[👥 Usuarios/inquilino]]
