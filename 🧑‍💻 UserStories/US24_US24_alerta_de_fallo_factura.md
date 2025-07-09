# US24

## Alerta fallo de facura

**Caso de Uso:** [[📄 CasosDeUso/CU10_VERIFICAR_ERRORES_Y_LOGS_DEL_SISTEMA]]

Como admin, quiero recibir alertas cuando falle una factura, para actuar rápidamente.

### Contenido de la Alerta

Las alertas de fallo de facturación enviadas a los administradores deben contener información clara y suficiente para permitir la identificación y el diagnóstico rápido del problema. El contenido clave incluye:

1.  **Tipo de Alerta:** Indica si es un fallo leve (un intento fallido que podría ser reintentado) o un fallo crítico (todos los reintentos agotados). Por ejemplo: "Alerta de Fallo de Facturación" o "Alerta CRÍTICA de Fallo de Facturación".
2.  **Identificación del Pago/Contrato Afectado:** Referencias que permitan localizar el pago y el contrato.
    *   ID del Pago: <CODE_BLOCK>payment_id</CODE_BLOCK> del pago asociado.
    *   ID del Contrato: <CODE_BLOCK>contract_id</CODE_BLOCK> del contrato asociado.
    *   Referencia legible (Opcional pero útil): Por ejemplo, la dirección de la propiedad, nombre del propietario o inquilino.
3.  **Fecha del Pago:** La fecha de vencimiento (<CODE_BLOCK>due_date</CODE_BLOCK>) del pago para el que se intentó generar la factura.
4.  **Momento del Fallo:** La fecha y hora exactas en que ocurrió el último intento fallido.
5.  **Descripción del Error:** Una breve explicación de la causa raíz del fallo.
    *   Origen del error (ej. "Error interno", "Fallo de comunicación con SW Sapien", "Error reportado por SW Sapien").
    *   Mensaje de error específico (si está disponible, como un mensaje de validación de SW Sapien).
6.  **Número de Intento:** Para fallos leves, indica qué intento falló (ej. "Intento 1 fallido", "Intento 3 fallido").
7.  **Estado del Proceso de Reintentos:** Para alertas críticas, indica que se han agotado todos los intentos de reintento definidos para ese pago.
8.  **Sugerencia de Acción:** Para fallos críticos, proporciona una indicación inicial de las posibles causas o acciones a seguir (ej. "Revisar datos fiscales", "Verificar estado de SW Sapien", "Requiere intervención manual").
9.  **Enlace (Opcional):** Si existe una interfaz de administración, un enlace directo al detalle del pago o contrato afectado para facilitar la investigación.