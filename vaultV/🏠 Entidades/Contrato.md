# Contrato

Acuerdo formal entre un [[Propietario]] y un único [[Inquilino]] para el alquiler de un [[Inmueble]]. Define los términos clave del arrendamiento y controla la generación automatizada de [[Pago]]s y [[Factura]]s.

---

## 📌 Restricciones de la versión

> **Versión 1.0:**  
> Todos los contratos son a término fijo de un año.  
> Cada contrato está asociado a un solo [[Inquilino]] y un solo [[Inmueble]].  
> Un [[Inquilino]] puede tener múltiples contratos (históricos), pero no contratos activos simultáneos sobre el mismo [[Inmueble]].

---

## ✨ Atributos funcionales

- Fecha de inicio
- Fecha de fin
- Monto mensual de renta
- Día del mes para el [[Pago]]
- Cláusulas y condiciones específicas
- [[Inmueble]] asociado
- [[Propietario]] asociado
- [[Inquilino]] asociado
- Historial de [[Pago]]s y [[Factura]]s generadas
- Estado actual del contrato

---

## 🔁 Ciclo de vida del Contrato

Un contrato atraviesa distintos estados funcionales durante su existencia:

- **Activo**  
  Estado inicial. Se generan [[Factura]]s y [[Pago]]s mensuales.

- **Próximo a vencer**  
  Estado derivado automáticamente cuando faltan menos de 30 días para la fecha de fin.  
  Este estado permite la visualización anticipada del vencimiento y puede ser usado para gatillar alertas o acciones externas (como notificaciones), pero esas acciones se definen en otro módulo.

- **Finalizado**  
  Ocurre automáticamente al día siguiente de la fecha de fin.  
  Detiene generación de pagos y marca el [[Inmueble]] como disponible.

- **Cancelado**  
  Puede ocurrir manualmente por un [[Administrador]] antes de la fecha de fin, o automáticamente si se elimina el [[Propietario]] o [[Inquilino]].  
  Detiene la generación de futuras [[Factura]]s y [[Pago]]s.

---

## 🚫 Validaciones funcionales

- No se permite más de un contrato activo sobre el mismo [[Inmueble]]
- La fecha de inicio debe ser anterior a la fecha de fin
- El [[Inquilino]] no puede tener contratos activos simultáneos sobre la misma propiedad
- El monto mensual debe ser mayor a 0
- El día de pago debe estar entre 1 y 28

---

## 🔗 Relaciones funcionales

- **[[Propietario]]**: Dueño del [[Inmueble]]. Recibe las [[Factura]]s.
- **[[Inquilino]]**: Responsable de los [[Pago]]s mensuales. Visualiza su historial.
- **[[Inmueble]]**: Se marca como “ocupado” mientras el contrato esté activo.
- **[[Administrador]]**: Puede visualizar, cancelar o finalizar contratos.
