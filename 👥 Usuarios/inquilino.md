## Perfil: Inquilino

Persona que renta una propiedad.

---

### 🔁 Casos de Uso relacionados
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU07_notificaciones_email]]

---

### Detalles del Perfil

**Detailed Permissions and Access Levels:** View their single active rental contract and its invoices. View past contracts and their related invoices (historical access). Receive email notifications for new invoices on the active contract. No edit, create, or delete permissions.

**Key Responsibilities:** Stay informed about current and past tenancy by viewing documents (contracts, invoices) and notifications for the active contract. Provide accurate RFC for current invoicing.

**Interactions with Other Roles:** Primarily interacts with the System (viewing current/past documents, receiving active contract notifications). Communication/actions like payments are likely external. Admin manages contracts; system uses RFC for active invoicing and sends notifications.

**Specific Needs and Goals:** Easy access to current and past contracts/invoices, timely new invoice notifications for the active contract, and ensuring correct RFC for current invoicing. Goal is to stay informed about tenancy history and financial responsibilities and receive accurate current invoices.

---

### Propiedades del Sistema

These are the key properties representing a Tenant within the system's data model:

- `rfc` (Unique Identifier): The RFC serves as the primary unique identifier.
- `user_id` (Foreign Key, optional): Link to a general users table if applicable.
- `full_name`: The complete name of the tenant(s).
- `email`: The email address for notifications and communication.
- `phone_number` (Optional): A contact number.
- `status` (Overall tenant status): E.g., 'current tenant', 'former tenant'.
- `contract_ids` (Relationship/Foreign Keys): Links to multiple contracts (representing tenancy history).
- `created_at`: Timestamp for when the tenant record was created.
- `deleted_at` (Timestamp, optional): Timestamp indicating when the record was logically deleted (for soft deletion).