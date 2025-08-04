# Administrador

Rol exclusivo asignado a un [[Usuario]] con permisos para supervisar el sistema, gestionar entidades y resolver incidencias. No se combina con otros roles.

---

## ✨ Responsabilidades funcionales
- Alta, edición y desactivación de [[Usuario]]s.
- Asignación y retiro de [[Rol]]es (`[[Propietario]]`, `[[Inquilino]]`, `[[Contador]]`).
- Creación, cancelación y finalización manual de [[Contrato]]s.
- Alta, baja y edición de [[Inmueble]]s.
- Supervisión del estado general del sistema (salud, tareas automáticas, alertas).
- Monitoreo del proceso de facturación y notificaciones (definido en su módulo correspondiente).

---

## 🔁 Ciclo de vida del rol
- **Asignación**: Otorgado por un administrador existente.
- **Activo/Inactivo**: Puede desactivarse para restringir acceso sin eliminar el [[Usuario]].
- **Exclusividad**: No puede coexistir con otros rol(es).

---

## 🚫 Validaciones funcionales
- Un [[Usuario]] con rol **Administrador** no puede tener otros roles.
- Debe existir siempre al menos un **Administrador** activo en el sistema.

---

## 🔗 Relaciones
- Gestiona [[Usuario]]s, [[Inmueble]]s y [[Contrato]]s.
- Supervisa la emisión de [[Factura]]s y estado de [[Pago]]s (visibilidad global).
