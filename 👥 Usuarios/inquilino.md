## Perfil: Inquilino

Persona que renta una propiedad.

---

### 🔁 Casos de Uso relacionados
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU07_notificaciones_email]]

---

### Detalles del Perfil
**Detailed Permissions and Access Levels:** View **their active rental contracts** and their associated **invoices**. View past contracts and their related **invoices** (historical access). Receive email **notifications** for new invoices on **their active contracts** and payment due reminders. **Access to data (Contrato, Pago, Factura, Propiedad) is strictly limited to entities related to their contracts.** No edit, create, or delete permissions on core entity data (contracts, payments, invoices). Can edit their own profile data (if applicable, managed via the Usuario entity). Currently, an Inquilino receives two types of notifications: 'Factura generada' and 'Pago próximo a vencer'.

**Key Responsibilities:** Stay informed about current and past tenancy by viewing documents (**contracts**, **invoices**) and **notifications** for **active contracts**. Provide accurate RFC for current invoicing.

**Interactions with Other Roles:** Primarily interacts with the System (viewing current/past documents, receiving **active contract notifications**). Communication/actions like payments are likely external. Admin manages **contracts**; system uses RFC for active invoicing and sends **notifications**.

**Specific Needs and Goals:** Easy access to current and past **contracts/invoices**, timely new invoice **notifications** for **active contracts** (specifically 'Factura generada' and 'Pago próximo a vencer'), and ensuring correct RFC for current invoicing. Goal is to stay informed about tenancy history and financial responsibilities and receive accurate current **invoices**.

---

### Propiedades del Sistema

These are the key properties representing an Inquilino within the system's data model. Note that the core user data is managed by the [[🏠 Entidades/usuario]] entity, and this profile likely links to it via `user_id` if implemented this way.

- `user_id` (Foreign Key, optional): Link to a general users table if applicable.
- `full_name`: The complete name of the tenant(s).
- `email`: The email address for notifications and communication.
- `phone_number` (Optional): A contact number.
- `rfc` (String, Optional): The RFC serves for invoicing purposes.
- `status` (Overall tenant status): E.g., 'current tenant', 'former tenant'.
- `contract_ids` (Relationship/Foreign Keys): Links to multiple contracts (representing tenancy history).
- `created_at`: Timestamp for when the tenant record was created.
- `deleted_at` (Timestamp, optional): Timestamp indicating when the record was logically deleted (for soft deletion).

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US07_CU03_gestionar_inquilinos]]
- [[🧑‍💻 UserStories/US08_CU03_gestionar_inquilinos]]
- [[🧑‍💻 UserStories/US15_listar_facturas]] (Limited to their own invoices)
- [[🧑‍💻 UserStories/US16_CU07_enviar_notificaciones_por_email]] (As recipient)
- [[🧑‍💻 UserStories/US18_reporte_financiero]] (Viewing report based on their payments/invoices)
- [[🧑‍💻 UserStories/US19_listar_facturas]] (Limited to their own invoices)
- [[🧑‍💻 UserStories/US20_listar_facturas_admin]] (Not directly, but admin can view tenant's invoices)
- [[🧑‍💻 UserStories/US25_CU11_gestionar_accesos_y_credenciales]] (Managing their own profile via the Usuario entity)

### 👥 Roles Relacionados
- [[👥 Usuarios/admin]] (Manages their account and contracts)
- [[👥 Usuarios/propietario]] (Owner of the property they rent, indirect interaction via contract)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/contrato]] (Direct relationship, multiple contracts possible)
- [[🏠 Entidades/factura]] (Related via Contrato and Pago)
- [[🏠 Entidades/pago]] (Related via Contrato)
- [[🏠 Entidades/propiedad]] (Indirect relationship via Contrato)
- [[🏠 Entidades/notificacion]] (As recipient)
- [[🏠 Entidades/log]] (As actor of certain actions, e.g., viewing data)