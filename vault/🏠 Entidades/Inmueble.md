# Inmueble

Una ubicación física propiedad de un [[Propietario]] que puede ser rentada a un [[Inquilino]] a través de un [[Contrato]].

**Información clave:**
*   Calle
*   Número exterior
*   Número interior
*   Colonia
*   Código postal
*   Municipio
*   Estado
*   Alias (nombre corto para identificar el inmueble)
*   Características relevantes (ej. número de habitaciones, baños, estacionamientos, amenidades)
*   Historial de [[Contrato]]s asociados
*   **Estado** (ej. 'vacío', 'rentado', 'eliminado')

**Ciclo de Vida:**

Un inmueble se crea inicialmente en estado 'vacío'. Puede cambiar a estado 'rentado' cuando se asocia a un [[Contrato]] activo. Al finalizar o expirar un [[Contrato]], el inmueble puede volver a estado 'vacío' o mantener el estado 'rentado' si se asocia a un nuevo [[Contrato]] inmediatamente. Los inmuebles pueden ser marcados como eliminados en el sistema, lo cual solo puede ser iniciado por un [[Administrador]].

**Eliminación de Inmueble:**

Solo un [[Administrador]] puede iniciar la eliminación de un inmueble. Al intentar eliminar un inmueble:
*   Si el inmueble tiene [[Contrato]]s con estado 'activo' asociados, el sistema **no debe permitir la eliminación directa del inmueble**. En su lugar, el [[Administrador]] debe proceder primero a **cancelar los [[Contrato]]s activos** asociados a ese inmueble.
*   Una vez que todos los [[Contrato]]s asociados a un inmueble ya no estén en estado 'activo' (es decir, estén 'finalizados' o 'cancelados'), el [[Administrador]] podrá proceder a marcar el inmueble como eliminado, cambiando su **Estado** a 'eliminado'.
