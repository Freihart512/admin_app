# Pago

Representa una obligación específica de pago de alquiler mensual generada por un [[Contrato]]. Esta entidad rastrea la fecha de vencimiento y el monto adeudado, y es el desencadenante para la generación automática de la [[Factura]] correspondiente.

**Nota V1.0 (Alcance Actual):** En esta versión, el registro de pagos no se implementará. Se asumirá que un pago cambia su estado a 'pagado' automáticamente al llegar su fecha de vencimiento.

**Información clave:**
*   Monto adeudado
*   Fecha de vencimiento del pago
*   [[Contrato]] al que pertenece el pago
*   [[Factura]] asociada a este pago (si ya ha sido generada)
*   Estado (ej. 'pendiente', 'pagado', 'vencido', 'cancelado', 'facturado')

**Ciclo de Vida:**

Un registro de Pago se crea automáticamente cuando se activa un [[Contrato]] o de manera mensual según los términos del [[Contrato]]. Su estado inicial es 'pendiente'.

El estado de un Pago puede cambiar a lo largo de su ciclo de vida:
*   Al llegar la fecha de vencimiento del pago, el estado cambia automáticamente a **'pagado'** (según el alcance actual de la V1.0).
*   Una vez que se genera la [[Factura]] correspondiente a un Pago (como parte del proceso de facturación automática), el estado del Pago se actualiza a **'facturado'**.
*   El estado puede pasar a ser **'vencido'** si la fecha de vencimiento pasa y, por alguna razón, no se ha marcado automáticamente como 'pagado' o 'facturado' (aunque en V1.0 la transición a 'pagado' es automática al vencimiento).
*   El estado cambia a **'cancelado'** si el [[Contrato]] asociado se finaliza prematuramente o si el pago ya no es requerido por alguna otra razón (incluyendo la cancelación del [[Contrato]] debido a la eliminación de un [[Propietario]] o [[Inquilino]] asociado).
