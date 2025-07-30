# Inquilino

Rol asignado a un [[Usuario]] que renta uno o varios [[Inmueble]]s a través de [[Contrato]]s gestionados en la plataforma. La información general del [[Usuario]] (como nombre, correo electrónico, teléfono, dirección, RFC) se gestiona en la entidad [[Usuario]].

**Impacto de la Desactivación del Rol de Inquilino:**

Cuando el rol de inquilino de un [[Usuario]] es marcado como inactivo, este proceso debe ser completo y garantizar la consistencia de los datos. La desactivación del rol de inquilino, generalmente como parte de la desactivación general del [[Usuario]], desencadena las siguientes acciones:

*   El registro del rol de inquilino se marca como inactivo.
*   Todos los [[Contrato]]s asociados a este inquilino que estén en estado 'activo' deben cambiar su estado a 'cancelado'. Esto implica la cancelación de los [[Pago]]s futuros asociados y detiene la generación de futuras [[Factura]]s.
*   La cuenta de [[Usuario]] asociada debe ser marcada como inactiva si el rol de inquilino es el único rol activo que le queda. Si tiene otros roles activos, la cuenta de [[Usuario]] puede permanecer activa, pero el rol 'inquilino' debe ser removido de la lista de roles activos del usuario.

**Nota:** El sistema no debe permitir marcar el rol de inquilino como inactivo si el proceso de desactivación no puede completarse exitosamente o dejaría datos inconsistentes en el sistema.

**Validaciones Clave para el Rol:**

*   Un [[Usuario]] solo puede tener un registro asociado a este rol de inquilino.
*   El [[Usuario]] asociado debe tener el rol de 'inquilino' asignado en la entidad [[Usuario]].

**Relaciones:**

Un [[Usuario]] con el rol de [[Inquilino]]:

*   Está asociado a uno o más [[Contrato]]s como arrendatario.
*   Está indirectamente asociado a los [[Inmueble]]s a través de sus contratos.
*   Recibe notificaciones relacionadas con sus contratos y [[Pago]]s.
*   Puede ver [[Factura]]s y [[Pago]]s relacionados con sus contratos.
