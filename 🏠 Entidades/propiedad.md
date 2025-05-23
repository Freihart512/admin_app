## Entidad: Propiedad

A physical location owned by a Propietario that can be rented to an Inquilino via a Contrato.

---

### Propiedades del Sistema

- `property_id` (Unique Identifier): A unique system-generated identifier for the property.
- `owner_id` (Foreign Key): A foreign key linking to the unique identifier of the owner who owns this property.
- `address`: The full physical address of the property.
- `characteristics`: Details describing the property, such as size, number of rooms, amenities, etc.
- `status`: The current rental status of the property (e.g., 'vacía', 'rentada').
- `created_at`: A system timestamp indicating the exact date and time the property record was created.
- `deleted_at` (Timestamp, Optional): A system timestamp indicating the exact date and time the property record was soft-deleted, if applicable.

### Ciclo de Vida

Una propiedad se crea inicialmente en estado 'vacía'. Puede cambiar a estado 'rentada' cuando se asocia a un contrato activo. Al finalizar o expirar un contrato, la propiedad puede volver a estado 'vacía' o mantener el estado 'rentada' si se asocia a un nuevo contrato inmediatamente. Las propiedades pueden ser soft-deleted del sistema.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU02_gestionar_propiedades]]
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU06_facturacion_automatica]]
- [[📄 CasosDeUso/CU08_resumen_historial]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US03_CU01_gestionar_propietarios]]
- [[🧑‍💻 UserStories/US04_CU02_gestionar_propiedades]]
- [[🧑‍💻 UserStories/US05_CU02_gestionar_propiedades]]
- [[🧑‍💻 UserStories/US06_CU02_gestionar_propiedades]]
- [[🧑‍💻 UserStories/US11_CU05_gestionar_contratos]]
- [[🧑‍💻 UserStories/US14_CU06_generar_facturas_automáticamente]]
- [[🧑‍💻 UserStories/US15_CU06_generar_facturas_automáticamente]]
- [[🧑‍💻 UserStories/US18_CU08_consultar_resúmenes_e_historial]]
- [[🧑‍💻 UserStories/US20_CU08_consultar_resúmenes_e_historial]]

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario]]
- [[👥 Usuarios/inquilino]]