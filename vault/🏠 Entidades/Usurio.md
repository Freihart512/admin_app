# Usuario

Representa una persona que interactúa con el sistema, con credenciales de acceso y uno o más [[Rol]]es asignados ([[Administrador]], [[Propietario]], [[Inquilino]], [[Contador]]). Sirve como base para la autenticación y autorización dentro de la plataforma.

**Información clave:**
*   Correo electrónico: La dirección de correo electrónico principal del usuario, utilizada para el inicio de sesión y notificaciones. Debe ser único en el sistema.
*   Nombre
*   Apellido
*   Número de teléfono (obligatorio para [[Propietario]] e [[Inquilino]], opcional para [[Administrador]] y [[Contador]])
*   Dirección (obligatorio para [[Propietario]] e [[Inquilino]], opcional para [[Administrador]]es o [[Contador]]es)
*   RFC (Registro Federal de Contribuyentes): Un identificador fiscal único. Es obligatorio para [[Propietario]] e [[Inquilino]] y debe ser único globalmente entre los usuarios que lo tienen definido.
*   [[Rol]]es asignados: La lista de [[Rol]]es que tiene el usuario. Un usuario puede tener varios roles, excepto el rol de [[Administrador]], que es exclusivo. Un usuario debe tener al menos un rol asignado.
*   Contraseña: Credenciales seguras para acceder al sistema.
*   Estado de la cuenta: Indica si la cuenta de usuario está activa o inactiva.

**Ciclo de Vida Típico:**

Un usuario es creado por un [[Administrador]] o a través de un proceso de registro. Puede iniciar sesión usando su correo electrónico y contraseña, cambiar su contraseña o recuperarla si la olvida. Los [[Administrador]]es pueden gestionar la información del perfil del usuario, asignar o modificar sus [[Rol]]es, y activar o desactivar su cuenta.

**Impacto de la Eliminación de Usuario:**

Cuando un [[Usuario]] es marcado como eliminado (desactivación), este proceso debe ser completo y mantener la consistencia de los datos en el sistema. La eliminación de un [[Usuario]] desencadena acciones relacionadas con las entidades de negocio asociadas a sus [[Rol]]es:

*   Si el [[Usuario]] tiene el rol [[Propietario]]: La eliminación del [[Usuario]] también implica la eliminación del registro asociado como [[Propietario]]. Esto, a su vez, desencadena la cancelación de [[Contrato]]s activos y la eliminación de [[Inmueble]]s asociados a ese propietario, según lo definido en las entidades [[Contrato]] e [[Inmueble]].
*   Si el [[Usuario]] tiene el rol [[Inquilino]]: La eliminación del [[Usuario]] también implica la eliminación del registro asociado como [[Inquilino]]. Esto, a su vez, desencadena la cancelación de [[Contrato]]s activos asociados a ese inquilino.
*   Si el [[Usuario]] tiene el rol [[Contador]]: La eliminación del [[Usuario]] también implica la eliminación del registro asociado como [[Contador]]. Esto, a su vez, implica eliminar la asociación con cualquier [[Propietario]] al que estuviera vinculado.
*   Si el [[Usuario]] tiene el rol [[Administrador]]: El registro de usuario simplemente se marca como eliminado. Sus acciones previas registradas deben permanecer asociadas a su identificador (esto último es un detalle de cómo se mantiene el rastro, podemos quitarlo si quieres ser aún más estricto con lo no técnico).

**Nota General sobre Eliminación:** El sistema no debe permitir marcar un [[Usuario]] como eliminado si el proceso de eliminación en cascada no puede completarse exitosamente para todos sus roles asociados o dejaría datos inconsistentes en el sistema.

**Validaciones Clave:**

*   El correo electrónico debe tener un formato válido y ser único en el sistema.
*   Nombre y Apellido son obligatorios.
*   El número de teléfono debe tener un formato válido y es obligatorio para usuarios con el rol [[Propietario]] o [[Inquilino]]. Es opcional para [[Administrador]]es o [[Contador]]es.
*   La dirección es obligatoria para usuarios con el rol [[Propietario]] o [[Inquilino]]. Es opcional para [[Administrador]]es o [[Contador]]es.
*   El RFC debe tener un formato válido y ser único globalmente entre todos los usuarios que lo tienen definido. Este campo es obligatorio para usuarios con el rol [[Propietario]] o [[Inquilino]].
*   La lista de [[Rol]]es debe ser válida. La lista no puede contener el rol [[Administrador]] y otros roles simultáneamente. Un usuario debe tener al menos un rol asignado.

**Relaciones por Rol:**

Las relaciones de la entidad [[Usuario]] con otras entidades y funcionalidades dependen de los [[Rol]]es asignados. Un usuario puede tener múltiples de estas relaciones si tiene múltiples roles:

*   **[[Administrador]]:** Puede gestionar la mayoría de las [[Entidades]]. Puede ser el [[Usuario]] registrado en un historial de acciones por tareas de administración. Recibe notificaciones de alerta del sistema.
*   **[[Propietario]]:** Está asociado a los [[Inmueble]]s que posee. Está asociado a los [[Contrato]]s creados para sus inmuebles. Puede tener un [[Contador]] asociado. Recibe notificaciones relacionadas con sus inmuebles, contratos, [[Factura]]s y [[Pago]]s. Puede ver [[Factura]]s y [[Pago]]s relacionados con sus inmuebles/contratos.
*   **[[Inquilino]]:** Está asociado a [[Contrato]]s como arrendatario. Recibe notificaciones relacionadas con sus contratos y [[Pago]]s. Puede ver [[Factura]]s y [[Pago]]s relacionados con sus contratos.
*   **[[Contador]]:** Puede estar asociado a uno o más [[Propietario]]s para recibir notificaciones y acceso a información fiscal. Recibe notificaciones relacionadas con las [[Factura]]s de los propietarios a los que está asociado.
