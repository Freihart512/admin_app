# Propietario

Rol asignado a un [[Usuario]] que es propietario de uno o varios [[Inmueble]]s gestionados en la plataforma. La información general del [[Usuario]] (como nombre, correo electrónico, teléfono, dirección, RFC) se gestiona en la entidad [[Usuario]].

**Información específica del rol:**
*   Estado del rol de propietario: El estado actual de la asociación del [[Usuario]] con este rol (ej. 'activo', 'inactivo'). Este estado se refiere específicamente al rol de propietario y puede ser independiente del estado general de la cuenta de [[Usuario]] (aunque la desactivación general del [[Usuario]] debe impactar este estado).

**Ciclo de Vida Típico del Rol:**

Un usuario adquiere el rol de propietario típicamente cuando un [[Administrador]] le asigna este rol. El rol puede ser marcado como inactivo por un [[Administrador]]. La asignación del rol de propietario a un usuario puede desencadenar el envío de una notificación de bienvenida. La edición de la información general del propietario (nombre, correo electrónico, RFC, etc.) se realiza a través de la gestión de la entidad [[Usuario]].

**Impacto de la Desactivación del Rol de Propietario:**

Cuando el rol de propietario de un [[Usuario]] es marcado como inactivo, este proceso debe ser completo y garantizar la consistencia de los datos. La desactivación del rol de propietario, generalmente como parte de la desactivación general del [[Usuario]], desencadena las siguientes acciones:

*   El registro del rol de propietario se marca como inactivo.
*   Todos los [[Contrato]]s asociados a los [[Inmueble]]s de este propietario que estén en estado 'activo' deben cambiar su estado a 'cancelado'. Esto implica la cancelación de los [[Pago]]s futuros asociados y detiene la generación de futuras [[Factura]]s.
*   Todos los [[Inmueble]]s asociados a este propietario deben ser marcados como eliminados.

**Nota:** El sistema no debe permitir marcar el rol de propietario como inactivo si el proceso de desactivación no puede completarse exitosamente o dejaría datos inconsistentes en el sistema.

**Validaciones Clave para el Rol:**

*   Un [[Usuario]] solo puede tener un registro asociado a este rol de propietario.
*   El [[Usuario]] asociado debe tener el rol de 'propietario' asignado en la entidad [[Usuario]].

**Relaciones:**

Un [[Usuario]] con el rol de [[Propietario]]:

*   Está asociado a los [[Inmueble]]s que posee (relación uno a muchos).
*   Está indirectamente asociado a los [[Contrato]]s creados para sus inmuebles.
*   Puede tener un único [[Contador]] asociado para fines fiscales.
*   Recibe notificaciones relacionadas con sus inmuebles, contratos, [[Factura]]s y [[Pago]]s.
*   Puede ver [[Factura]]s y [[Pago]]s relacionados con sus inmuebles/contratos.
