## Perfil: Contador

Persona encargada de la contabilidad del propietario.

---

### 🔁 Casos de Uso relacionados
- [[📄 CasosDeUso/CU04_gestionar_contadores]]
- [[📄 CasosDeUso/CU07_notificaciones_email]]

### Detalles del Rol

**Detailed Permissions and Access Levels:** Limited to viewing invoices associated with linked owners' properties and receiving these invoices via email notification. No edit, create, or delete permissions; no access to other financial data besides invoices.

**Key Responsibilities:** Receive and access invoice documents for associated owners' properties for external accounting purposes.

**Interactions with Other Roles:** Primarily interacts with the System (receiving email notifications) and indirectly with the Owner. Admin links the Accountant to the Owner and configures their email.

**Specific Needs and Goals:** Reliably receive invoice notifications via email and access corresponding invoices within the system.

### Propiedades del Sistema

- `accountant_id` (Unique Identifier)
- `user_id` (Foreign Key, if applicable)
- `full_name`
- `email`
- `phone_number` (Optional)
- `status`
- `created_at`
- `deleted_at` (Timestamp for soft deletion)