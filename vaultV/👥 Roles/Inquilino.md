# Inquilino

Rol asignado a un [[Usuario]] que ocupa un [[Inmueble]] mediante un [[Contrato]] y es responsable de sus [[Pago]]s y recepción de [[Factura]]s.

---

## ✨ Responsabilidades funcionales
- Consultar el estado de su [[Contrato]] actual (`activo`, `próximo a vencer`, `finalizado`, `cancelado`).
- Acceder a su historial de [[Contrato]]s.
- Visualizar y descargar sus [[Factura]]s.
- Consultar estado de [[Pago]]s (pendiente/pagado/facturado/cancelado).

---

## 🔁 Ciclo de vida del rol
- **Asignación**: Al crearse o activarse un [[Contrato]].
- **Activo/Inactivo**: Si el rol se inactiva, no se borran contratos/facturas históricas.
- **Cambio de inmueble**: A través de un nuevo [[Contrato]].

---

## 🚫 Validaciones funcionales
- Debe contar con datos de contacto y RFC para facturación.
- No puede tener contratos activos simultáneos sobre el mismo [[Inmueble]].

---

## 🔗 Relaciones
- Inquilino ↔ [[Contrato]]s.
- Inquilino ↔ [[Factura]]s y [[Pago]]s asociados a sus contratos.
