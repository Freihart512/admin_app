# Contrato

Un acuerdo formal entre un [[Propietario]] y un único [[Inquilino]] para el alquiler de un [[Inmueble]]. Define términos clave y desencadena la generación de [[Pago]]s y [[Factura]]s correspondientes.

**Nota V1.0:** En esta versión, todos los contratos son a término fijo de un año y están limitados a un único inquilino. Un mismo inquilino puede estar asociado a múltiples contratos a lo largo del tiempo (históricos y activos, aunque no para la misma property simultáneamente debido a las validaciones en la creación).

**Información clave:**
*   Fecha de inicio del contrato
*   Fecha de fin del contrato
*   Monto de la renta mensual
*   Día del mes para el [[Pago]] de la renta
*   Cláusulas y términos específicos del contrato
*   [[Inmueble]] asociado
*   [[Propietario]] asociado
*   [[Inquilino]] asociado
*   Historial de [[Pago]]s asociados
*   Historial de [[Factura]]s asociadas
*   **Estado actual del contrato**

**Ciclo de Vida:**

Un contrato atraviesa diferentes estados a lo largo de su existencia:

*   Se crea inicialmente con **status: 'activo'**.
*   Al alcanzar su fecha de fin, el status cambia automáticamente a **status: 'finalizado'** a partir del día siguiente a la fecha de fin.
*   Un [[Administrador]] puede **cancelar manualmente** el contrato antes de su fecha de fin. Cuando un contrato es cancelado manualmente, el status cambia a **status: 'cancelado'**.
*   Si un contrato es **cancelado** (manualmente por un administrador o automáticamente por el sistema), sus [[Pago]]s futuros asociados deben ser marcados como cancelados y no se deben generar [[Factura]]s futuras para estos [[Pago]]s cancelados.
*   Un contrato también puede ser **cancelado automáticamente** por el sistema si el [[Propietario]] o [[Inquilino]] asociado es eliminado de la plataforma. Esta cancelación en cascada sigue las mismas reglas con respecto a los [[Pago]]s y [[Factura]]s futuras asociados.

**Historial de Cambios:**

Se deberá implementar un mecanismo para registrar y consultar el historial de modificaciones realizadas en los datos de un contrato. Esto incluirá la fecha del cambio, el [[Usuario]] que realizó la modificación y los detalles de los campos afectados.

**Estados del Contrato:**

*   **activo:** El contrato está actualmente en vigor.
*   **finalizado:** El contrato ha llegado a su fecha de fin.
*   **próximo a vencer:** Este estado se activará automáticamente dos meses antes de la fecha de finalización del contrato.
*   **cancelado:** El contrato ha sido cancelado manualmente por un [[Administrador]] o automáticamente por el sistema (ej. al eliminar un [[Propietario]] o [[Inquilino]] asociado). Los contratos en este estado no deben considerarse activos y sus futuros [[Pago]]s asociados deben ser marcados como cancelados.
