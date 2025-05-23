## Perfil: Propietario

Persona que posee una o más propiedades en renta.

---

### 🔁 Casos de Uso relacionados
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU02_gestionar_propiedades]]
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU06_facturacion_automatica]]
- [[📄 CasosDeUso/CU08_resumen_historial]]
- [[📄 CasosDeUso/CU11_usuarios_y_accesos]]

---

### 📝 Detalles del Rol

**Detailed Permissions and Access Levels:** View-only access to property-related info. Includes: viewing property list/status, accessing property/contract/active contract dashboard overview, viewing/downloading property invoices, viewing monthly income summaries per property, viewing invoicing history per contract, managing own account credentials. Ability to create, modify, and delete the association of a *single active* Accountant to their account. This associated Accountant will have access to all of the owner's property invoices. No access to other owners' info, properties not owned, admin features, or ability to create/modify/delete properties.

**Key Responsibilities:** Track property financial performance via reports/invoices, manage their single active accountant association, maintain account security.

**Interactions with Other Roles:** Actively interacts with System (viewing data/reports, managing their single active accountant). Indirectly with Tenants (contracts/invoices). Directly with their single active Accountant (by managing their association). Admin manages user account and initial property associations.

**Specific Needs and Goals:** Clear financial reports/historical data, control over which single accountant can access all of their financial information, account security. Goal: understand portfolio financial performance, manage their single accounting access.

---

### 🗄️ Propiedades del Sistema

These are the key properties representing an Owner within the system:

- `rfc` (Unique Identifier / Primary Key): The RFC serves as the unique identifier for the owner.
- `user_id` (Foreign Key, optional): If owners are also considered a type of user in a general `users` table.
- `full_name`: The complete name of the owner(s).
- `email`: The email address for communication, notifications, and login.
- `phone_number` (Optional): A contact number.
- `status`: The status of the owner account (e.g., 'active', 'inactive').
- `properties_ids` (Relationship/Foreign Keys): A mechanism to link the owner to multiple properties they own (view-only access to these properties' data).
- `active_accountant_id` (Foreign Key, nullable): Links to the single active accountant associated with this owner.
- `created_at`: Timestamp for account creation.
- `deleted_at` (Timestamp): For soft deletion.
- `password_hash`: Hashed password for login.

---

### 📎 Enlaces relacionados

- [[🧑‍💻 UserStories/US01_CU01_gestionar_propietarios]]
- [[🧑‍💻 UserStories/US02_CU01_gestionar_propietarios]]
- [[🧑‍💻 UserStories/US03_panel_propietario]]
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad]]
- [[🧑‍💻 UserStories/US05_listar_propiedades]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin]]
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato]]
- [[🧑‍💻 UserStories/US12_editar_contrato]]
- [[🧑‍💻 UserStories/US13_finalizar_contrato]]
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente]]
- [[🧑‍💻 UserStories/US15_listar_facturas]]
- [[🧑‍💻 UserStories/US18_reporte_financiero]]
- [[🧑‍💻 UserStories/US19_listar_facturas]]
- [[🧑‍💻 UserStories/US20_listar_facturas_admin]]
- [[🧑‍💻 UserStories/US25_registro_nuevo_usuario]]
- [[🧑‍💻 UserStories/US26_CU11_gestionar_accesos_y_credenciales]]