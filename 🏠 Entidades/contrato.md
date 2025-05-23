## Entidad: Contrato

A formal one-year agreement between a Propietario and a single Inquilino for the rental of a Propiedad, defining terms such as rental amount, start date, and monthly payment schedule, which generates 12 monthly payments and corresponding invoices.

### Propiedades del Sistema

- `contract_id` (Unique Identifier): A unique system-generated identifier for the contract.
- `property_id` (Foreign Key): A foreign key linking to the property being rented.
- `tenant_id` (Foreign Key): A foreign key linking to the single tenant on the contract.
- `start_date`: The commencement date of the one-year contract.
- `end_date`: The end date of the contract (calculated as one year after the start date).
- `rental_amount`: The monthly rental amount.
- `payment_due_day`: The day of the month payment is due (e.g., 1st, 5th, 15th).
- `status`: The current status of the contract (e.g., 'activo', 'finalizado', 'expired').
- `created_at`: Timestamp for when the contract was created.
- `updated_at`: Timestamp for when the contract was last edited.
- `finalized_at` (Timestamp, Optional): Timestamp for when the contract was finalized before its natural end date.
- `deleted_at` (Timestamp): Timestamp for when the contract record was soft-deleted.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU06_facturacion_automatica]]
- [[📄 CasosDeUso/CU08_resumen_historial]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US03_CU01_gestionar_propietarios]]
- [[🧑‍💻 UserStories/US10_CU05_gestionar_contratos]]
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato]]
- [[🧑‍💻 UserStories/US12_editar_contrato]]
- [[🧑‍💻 UserStories/US13_finalizar_contrato]]
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente]]
- [[🧑‍💻 UserStories/US19_listar_facturas]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin]]
- [[👥 Usuarios/propietario]]
- [[👥 Usuarios/inquilino]]
### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad]]
- [[🏠 Entidades/pago]]
- [[🏠 Entidades/factura]]