# Contador

Rol asignado a un [[Usuario]] profesional asociado a uno o varios [[Propietario]]s. Un usuario con este rol accede a información financiera de los propietarios a los que está vinculado. La información general del [[Usuario]] (nombre, correo electrónico, teléfono, dirección) se gestiona en la entidad [[Usuario]].

**Información específica del rol:**
*   Estado del rol de contador: El estado actual de la asociación del [[Usuario]] con este rol (ej. 'activo', 'inactivo'). Este estado se refiere específicamente al rol de contador y puede ser independiente del estado general de la cuenta de [[Usuario]].

**Ciclo de Vida Típico del Rol:**

Un usuario adquiere el rol de contador típicamente cuando un [[Administrador]] le asigna este rol. El rol puede ser marcado como inactivo por un [[Administrador]]. La asignación del rol de contador a un usuario puede desencadenar el envío de una notificación de bienvenida. La edición de la información general del contador se realiza a través de la gestión de la entidad [[Usuario]]. La asociación de un contador con uno o más propietarios se gestiona dentro del sistema.

**Impacto de la Desactivación del Rol de Contador:**

Cuando el rol de contador de un [[Usuario]] es marcado como inactivo, este proceso debe ser completo y garantizar la consistencia de los datos. La desactivación del rol de contador, generalmente como parte de la desactivación general del [[Usuario]], desencadena las siguientes acciones:

*   El registro del rol de contador se marca como inactivo.
*   Se elimina la asociación de este contador con cualquier [[Propietario]] al que estuviera vinculado.

**Nota:** El sistema no debe permitir marcar el rol de contador como inactivo si el proceso de desactivación no puede completarse exitosamente o dejaría datos inconsistentes en el sistema.

**Validaciones Clave para el Rol:**

*   Un [[Usuario]] solo puede tener un registro asociado a este rol de contador.
*   El [[Usuario]] asociado debe tener el rol de 'contador' asignado en la entidad [[Usuario]].

**Relaciones:**

Un [[Usuario]] con el rol de [[Contador]]:

*   Puede estar asociado a uno o más [[Propietario]]s para recibir notificaciones y acceso a información fiscal.
*   Recibe notificaciones relacionadas con las [[Factura]]s de los propietarios a los que está asociado.
*   Puede ver [[Factura]]s de los [[Propietario]]s a los que está asociado.
