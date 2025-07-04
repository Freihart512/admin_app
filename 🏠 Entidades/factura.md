## Entidad: Factura

Representa el documento fiscal formal (factura) generado por el sistema para un Pago mensual específico. Detalla el monto adeudado por el Inquilino al Propietario por el alquiler de una Propiedad y está directamente vinculado al registro de Pago correspondiente. La generación de un Pago desencadena la creación de una Factura.

### Propiedades del Sistema


- `invoice_id` (Identificador Único): Un identificador único generado por el sistema para la factura.
- `payment_id` (Clave Foránea): Una clave foránea que enlaza al Pago que esta factura representa.
- `invoice_number`: Un identificador único para la factura (generado por el sistema).
- `issue_date`: La fecha en que se generó la factura (primer día del mes).
- `due_date`: La fecha en que vence el pago (basada en el día de vencimiento de pago del contrato, heredada del Pago).
- `amount`: El monto del pago para esta factura.
- `fees_taxes` (Opcional): Cualquier tarifa o impuesto adicional.
- `total_amount`: El monto total adeudado.
- `status`: El estado actual de la factura (ej. 'pending_timbrado', 'timbrada', 'cancelada', 'error').
- `cfdi_data` (JSON, Opcional): Almacena los datos devueltos por la API de SW Sapien después del timbrado exitoso, incluyendo el UUID, cadena original, sello, etc.
- `created_at`: Marca de tiempo (fecha y hora) de cuándo se creó el registro de la factura.
- `deleted_at` (Marca de Tiempo, Opcional): Marca de tiempo (fecha y hora) de cuándo se eliminó lógicamente el registro de la factura.

### 🔁 Casos de Uso Relacionados
- [[📄 CasosDeUso/CU09_Integracion_SW_Sapien]]
- [[📄 CasosDeUso/CU06_Facturacion_Automatica]]
- [[📄 CasosDeUso/CU08_Resumen_Historial]]
- [[📄 CasosDeUso/CU07_Notificaciones_Email]]

### Ciclo de Vida Típico

1.  **Pending Timbrado (Pendiente de Timbrado)**: El registro de la factura es creado automáticamente por el sistema basado en un Pago.
2.  **Timbrada**: La factura es procesada exitosamente por la API de SW Sapien y recibe su validez fiscal.
3.  **Error**: El proceso de timbrado falla. El sistema debe registrar el error y potencialmente permitir reintentos manuales o revisión.
4.  **Cancelada**: La factura es cancelada en el sistema y ante el SAT a través de SW Sapien.

Nota: Los estados como 'unpaid' (no pagada), 'paid' (pagada), 'overdue' (vencida) típicamente se rastrean a nivel del Pago, no de la Factura, ya que la Factura es el documento fiscal, mientras que el Pago rastrea la transacción monetaria.

## Manejo de Errores de Timbrado (status: 'error')

Cuando una `Factura` cambia al estado `'error'` debido a un fallo en la integración con la API de SW Sapien, el sistema debe:

1.  Registrar un log de nivel `'ERROR'` detallado en la entidad `Log`, incluyendo el `invoice_id` relacionado, el mensaje de error recibido de la API de SW Sapien (si está disponible) y la marca de tiempo del fallo. Esto se relaciona con la [[🏠 Entidades/log.md]] y el [[📄 CasosDeUso/CU10_logs_y_errores.md]].
2.  Marcar la `Factura` con el estado `'error'`.
 3.  Enviar una notificación de alerta al rol de `admin` (según la [[🧑‍💻 UserStories/US24_Alerta_fallo_de_facura]]), informando sobre el fallo de timbrado para esa factura específica.

**Acciones Posteriores (Reintento/Revisión Manual):**

*   El sistema permitirá al `admin` intentar nuevamente el proceso de timbrado para una `Factura` en estado `'error'` a través de una acción manual.
*   Al intentar el reintento manual, el sistema intentará nuevamente enviar la solicitud de timbrado a la API de SW Sapien.
*   Si el reintento es exitoso, el estado de la `Factura` cambiará a `\'timbrada\'` y se actualizará el campo `cfdi_data`.\n*   Si el reintento falla, se registrará un nuevo log de error y la `Factura` permanecerá en estado `\'error\'`.
*   La interfaz de administración (aunque fuera del alcance V1.0) deberá proporcionar una forma clara para que los administradores identifiquen las facturas en estado `'error'` y ejecuten el reintento manual.


### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US14_Generar_Facturas_Automaticamente]]
- [[🧑‍💻 UserStories/US15_listar_facturas]]
- [[🧑‍💻 UserStories/US19_Listar_Facturas_propietario]]
- [[🧑‍💻 UserStories/US20_Listar_facturas_admin]]

### 👥 Roles Relacionados
- [[👥 Usuarios/Propietario]]
- [[👥 Usuarios/Inquilino]]
- [[👥 Usuarios/Admin]]
- [[👥 Usuarios/Contador]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/pago]]
- [[🏠 Entidades/log.md]]
- [[🏠 Entidades/notificacion.md]]
