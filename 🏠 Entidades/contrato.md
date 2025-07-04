## Entidad: Contrato

A formal one-year agreement between a Propietario and a single Inquilino for the rental of a Propiedad, defining terms such as rental amount, start date, and monthly payment schedule. This agreement triggers the generation of 12 monthly Payments and corresponding Invoices. **Note: In this V1.0, all contracts are for a fixed term of one year and are limited to a single tenant.**

### Propiedades del Sistema

- `contract_id` (Unique Identifier): A unique system-generated identifier for the contract.
- `property_id` (Foreign Key): A foreign key linking to the property being rented.
- `tenant_id` (Foreign Key): A foreign key linking to the single tenant on the contract.
- `start_date`: The commencement date of the one-year contract.
- `end_date`: The end date of the contract (calculated as one year after the start date).
- `rental_amount`: The monthly rental amount.
- `payment_due_day`: The day of the month payment is due (e.g., 1st, 5th, 15th).
- `status`: The current status of the contract (e.g., 'activo', 'finalizado', 'expired').
- `previous_contract_id` (Foreign Key, Optional): A foreign key linking to the previous contract if this contract is a renewal.
- `created_at`: Timestamp for when the contract was created.
- `updated_at`: Timestamp for when the contract was last edited.
- `finalized_at` (Timestamp, Optional): Timestamp for when the contract was finalized before its natural end date.
- `deleted_at` (Timestamp, Optional): Timestamp for when the contract record was soft-deleted or canceled.

### Ciclo de Vida
- A contract is initially created with `status: 'activo'`.
- Upon reaching its `end_date`, the status automatically changes to `status: 'finalizado'` starting the day after the `end_date`.
- An admin can manually set the status to `status: 'cancelado'` before the `end_date` by populating the `deleted_at` field.
- If a contract is soft-deleted (`deleted_at` is set, status changes to `cancelado`), its associated future Payments should be marked as cancelled, and no future Invoices should be generated for these cancelled Payments.
- A contract can also be marked as `status: 'cancelado'` (soft-deleted by populating `deleted_at`) automatically by the system if the associated Propietario or Inquilino is logically deleted. This cascaded cancellation follows the same rules regarding associated future Payments and Invoices.


## Historial de Cambios

Se deberá implementar un mecanismo para registrar y consultar el historial de modificaciones realizadas en los datos de un contrato. Esto incluirá la fecha del cambio, el usuario que realizó la modificación y los detalles de los campos afectados.

## Estados del Contrato

Además del estado "activo" y "finalizado", se añade el estado "próximo a vencer".

*   **activo:** El contrato está actualmente en vigor.
*   **finalizado:** El contrato ha llegado a su fecha de fin.
*   **próximo a vencer:** Este estado se activará automáticamente dos meses antes de la fecha de finalización del contrato.
*   **cancelado:** El contrato ha sido cancelado manualmente por un administrador o soft-deleted al popularse el campo `deleted_at`. Los contratos en este estado no deben considerarse activos y sus futuros pagos asociados deben ser marcados como cancelados.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU06_facturacion_automatica]]
- [[📄 CasosDeUso/CU08_resumen_historial]]

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US03_panel_propietario]]
- [[🧑‍💻 UserStories/US10_editar_contador]]
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato]]
- [[🧑‍💻 UserStories/US12_editar_contrato]]
- [[🧑‍💻 UserStories/US13_finalizar_contrato]]
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13: Cancelar contrato]]
### 👥 Roles Relacionados
- [[👥 Usuarios/admin]]
- [[👥 Usuarios/propietario]]
- [[👥 Usuarios/inquilino]]
### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad]] 
- [[🏠 Entidades/pago]]
- [[🏠 Entidades/factura]]