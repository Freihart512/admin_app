# US02

## Editar o desactivar propietario

Este User Story cubre las acciones que un administrador puede realizar sobre los datos y el estado de una cuenta de propietario existente.

**Caso de Uso:** [[📄 CasosDeUso/CU01_gestionar_propietarios]]

Como admin, quiero editar o desactivar propietarios existentes, para mantener datos actualizados.

### Actor

Admin

### Objetivo

Modificar la información de un propietario existente o cambiar su estado a inactivo (desactivar).

### Criterios de Aceptación

- **Editar Propietario:**
 - CA01: El Admin puede modificar los datos editables de un propietario existente (ej. nombre completo, email, teléfono).
 - CA02: Los cambios realizados al editar un propietario se guardan correctamente en el sistema.
 - CA03: Las validaciones de datos (ej. formato email) se aplican durante la edición.
- **Desactivar Propietario:**
 - CA04: El Admin puede marcar un propietario como inactivo (desactivar).
 - CA05: Al desactivar un propietario, el campo `deleted_at` en el registro del usuario propietario se actualiza con la marca de tiempo de la acción.
 - CA06: Todos los [[🏠 Entidades/contrato|Contrato]]s que se encuentren en estado `activo` y que estén asociados a las [[🏠 Entidades/propiedad|Propiedad]]es de este propietario son marcados automáticamente con el estado `cancelado`.
 - CA07: Todos los [[🏠 Entidades/pago|Pago]]s futuros asociados a los contratos cancelados (CA06) son marcados con un estado de cancelación o similar.
 - CA08: El sistema deja de generar automáticamente [[🏠 Entidades/factura|Factura]]s futuras para los pagos de los contratos cancelados (CA06).
 - CA09: Los propietarios desactivados no aparecen en las listas de selección o búsqueda para acciones que requieran un propietario activo (ej. asociar a nueva propiedad/contrato).
- **Restricción de Desactivación:**
 - CA10: El sistema previene la desactivación de un propietario si existen [[🏠 Entidades/contrato|Contrato]]s activos asociados que, por alguna razón, no pueden ser cancelados automáticamente como parte de la cascada definida. Se debe notificar al Admin de esta restricción.

**Detalles Backend:**
### 📝 Notas Adicionales

- La **re-activación** de un propietario es posible. Si un propietario es re-activado, recupera el acceso al sistema y vuelve a aparecer en las listas activas, pero esto **no revierte** la cancelación de contratos, pagos o facturas que ocurrió durante el período en que estuvo desactivado.

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/usuario]]
- [[🏠 Entidades/propiedad]]
- [[🏠 Entidades/contrato]]
- [[🏠 Entidades/pago]]
- [[🏠 Entidades/factura]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin]]
- [[👥 Usuarios/propietario]]