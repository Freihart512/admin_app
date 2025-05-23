## Entidad: Propiedad

A physical location owned by a Propietario that can be rented to an Inquilino via a Contrato.

---

### Propiedades del Sistema

- `property_id` (Unique Identifier): A unique system-generated identifier for the property.
- `owner_id` (Foreign Key): A foreign key linking to the unique identifier of the owner who owns this property.
- `address`: The full physical address of the property.
- `characteristics`: Details describing the property, such as size, number of rooms, amenities, etc.
- `status`: The current rental status of the property (e.g., 'rentada', 'vacía').
- `created_at`: A timestamp indicating when the property record was created in the system.
- `deleted_at` (Timestamp): A timestamp indicating when the property record was soft-deleted from the system, if applicable.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU02_gestionar_propiedades]]
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU06_facturacion_automatica]]
- [[📄 CasosDeUso/CU08_resumen_historial]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US03_CU01_gestionar_propietarios]]
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad]]
- [[🧑‍💻 UserStories/US05_listar_propiedades]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin]]
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato]]
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente]]
- [[🧑‍💻 UserStories/US15_listar_facturas]]
- [[🧑‍💻 UserStories/US18_reporte_financiero]]
- [[🧑‍💻 UserStories/US20_listar_facturas_admin]]

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario]]
- [[👥 Usuarios/inquilino]]