## Entidad: Propiedad

A physical location owned by a Propietario that can be rented to an Inquilino via a Contrato.

---

### Propiedades del Sistema

- `property_id` (Unique Identifier): A unique system-generated identifier for the property.
- `owner_id` (Foreign Key): A foreign key linking to the unique identifier of the owner who owns this property.
- `address`: The full physical address of the property.
- `features` (JSON, Optional): Structured data describing the property, such as number of bedrooms, bathrooms, square footage, amenities, etc.
- `status`: The current rental status of the property (e.g., 'vacía', 'rentada').
- `created_at`: A system timestamp indicating the exact date and time the property record was created.
- `deleted_at` (Timestamp, Optional): A system timestamp indicating the exact date and time the property record was soft-deleted, if applicable.
- `alias` (Texto): Un nombre opcional amigable o identificador interno asignado por el propietario o admin a la propiedad (ej. "Casa en la playa").


### Ciclo de Vida

Una propiedad se crea inicialmente en estado 'vacía'. Puede cambiar a estado 'rentada' cuando se asocia a un contrato activo. Al finalizar o expirar un contrato, la propiedad puede volver a estado 'vacía' o mantener el estado 'rentada' si se asocia a un nuevo contrato inmediatamente. Las propiedades pueden ser soft-deleted del sistema.

### Actualización del Estado de la Propiedad

*   El campo `status` de la propiedad (`rentada` o `vacía`) se actualizará automáticamente basado en la existencia y estado de los contratos asociados:
    *   Cuando se crea un `Contrato` con `status: \'activo\'` para una propiedad, el sistema debe cambiar el `status` de la propiedad a `'rentada'`.
    *   Cuando el último `Contrato` activo asociado a una propiedad cambia su estado a `'finalizado'` o `'cancelado'`, el sistema debe cambiar el `status` de la propiedad a `'vacía'`.

### Restricción de Eliminación Lógica

*   El sistema **no debe permitir** marcar una propiedad con `deleted_at` (eliminación lógica) si esta propiedad tiene al menos un `Contrato` con `status: \'activo\'` asociado. Cualquier intento de eliminar una propiedad con contratos activos debe resultar en un error.

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