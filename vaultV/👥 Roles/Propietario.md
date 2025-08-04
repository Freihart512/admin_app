# Propietario

Rol asignado a un [[Usuario]] dueño de uno o más [[Inmueble]]s. Recibe la facturación de los [[Contrato]]s asociados a sus propiedades y puede consultar el estado operativo.

---

## ✨ Responsabilidades funcionales
- Consultar estado de sus [[Inmueble]]s: `vacío`, `rentado`, `eliminado`.
- Visualizar contratos activos y su historial de [[Contrato]]s.
- Acceder y descargar [[Factura]]s generadas por sus contratos.
- Consultar estado de [[Pago]]s (pendiente, pagado, etc.).
- (Opcional) Asociar un [[Contador]] para gestión fiscal.

---

## 🔁 Ciclo de vida del rol
- **Asignación**: Por un [[Administrador]] o durante el alta del [[Usuario]].
- **Activo/Inactivo**: Al inactivarse, no se eliminan contratos ni facturas históricas.
- **Desasociación de contador**: Puede cambiar su [[Contador]] asignado.

---

## 🚫 Validaciones funcionales
- Debe tener datos de contacto y RFC para facturación.
- No puede eliminar [[Inmueble]]s con [[Contrato]]s `activo`.

---

## 🔗 Relaciones
- Propietario ↔ [[Inmueble]]s (uno a muchos).
- Propietario ↔ [[Contrato]]s (a través de sus inmuebles).
- Propietario ↔ [[Contador]] (opcional, uno a uno o uno a muchos según operación).
