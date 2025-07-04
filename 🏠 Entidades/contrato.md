## Entidad: Contrato

Un acuerdo formal de un año entre un Propietario y un único Inquilino para el alquiler de una Propiedad, definiendo términos como el monto del alquiler, fecha de inicio y calendario de pagos mensuales. Este acuerdo desencadena la generación de 12 Pagos mensuales y las Facturas correspondientes. **Nota: En esta V1.0, todos los contratos son a término fijo de un año y están limitados a un único inquilino.**
### Propiedades del Sistema

- `contract_id` (Identificador Único): Un identificador único generado por el sistema para el contrato.
- `property_id` (Clave Foránea): Una clave foránea que enlaza a la propiedad que se está rentando.
- `tenant_id` (Clave Foránea): Una clave foránea que enlaza al inquilino único en el contrato.
- `start_date`: The commencement date of the one-year contract.
- `end_date`: The end date of the contract (calculated as one year after the start date).
- `rental_amount`: El monto del alquiler mensual.
- `payment_due_day`: El día del mes en que vence el pago (ej. 1, 5, 15).
- `status`: The current status of the contract (e.g., 'activo', 'finalizado', 'expired').
- `previous_contract_id` (Clave Foránea, Opcional): Una clave foránea que enlaza al contrato anterior si este contrato es una renovación.
- `created_at`: Marca de tiempo de cuándo se creó el contrato.
- `updated_at`: Marca de tiempo de cuándo se editó por última vez el contrato.
- `finalized_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo se finalizó el contrato antes de su fecha de fin natural.
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo de cuándo el registro del contrato fue eliminado lógicamente o cancelado.

### Ciclo de Vida
- Un contrato se crea inicialmente con `status: 'activo'`.
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