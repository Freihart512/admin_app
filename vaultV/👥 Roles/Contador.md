# Contador

Rol asignado a un [[Usuario]] para consultar y gestionar las [[Factura]]s de uno o varios [[Propietario]]s a los que esté asociado.

---

## ✨ Responsabilidades funcionales
- Acceso a las [[Factura]]s emitidas de los propietarios asignados.
- Consulta de estado de [[Pago]]s para conciliación (lectura).
- Descarga masiva de comprobantes (según políticas del sistema).
- Soporte en correcciones administrativas (p. ej., notas de crédito en versiones futuras).

---

## 🔁 Ciclo de vida del rol
- **Asignación**: Por un [[Administrador]] o a solicitud del [[Propietario]].
- **Activo/Inactivo**: Al inactivarse, se mantiene el historial contable.
- **Cambios de asociación**: Puede agregarse o retirarse de propietarios específicos.

---

## 🚫 Validaciones funcionales
- El contador **solo** ve información de los propietarios a los que está asociado.
- No puede modificar [[Contrato]]s ni [[Inmueble]]s.

---

## 🔗 Relaciones
- Contador ↔ [[Propietario]](s) (asignaciones).
- Visualiza [[Factura]]s y estado de [[Pago]]s de dichos propietarios.
