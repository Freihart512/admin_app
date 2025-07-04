## Entidad: Pago

Representa una obligación específica de pago de alquiler mensual generada por un Contrato. Esta entidad rastrea la fecha de vencimiento y el monto adeudado, y es el desencadenante para la generación automática de la Factura correspondiente.

### Propiedades del Sistema

- `payment_id` (Identificador Único): Un identificador único generado por el sistema para el pago.
- `contract_id` (Clave Foránea): Una clave foránea que enlaza al contrato que generó este pago.
- `due_date` (Fecha): La fecha en que vence el pago.
- `amount` (Decimal): El monto del pago (debe coincidir con el monto del alquiler del contrato).
- `payment_period`: Indica el mes/año o período que cubre el pago (ej. "Enero 2024").
- `status`: El estado actual del pago (ej. 'due', 'paid', 'overdue', 'cancelled').
- `invoice_id` (Clave Foránea, Opcional): Una clave foránea que enlaza a la factura generada para este pago.
- `payment_date` (Marca de Tiempo, Opcional): La fecha y hora en que el pago fue realmente recibido y registrado en el sistema.
- `created_at` (Marca de Tiempo): La fecha y hora en que el registro del pago fue generado por el sistema (típicamente al crear el contrato o mensualmente).
- `updated_at` (Marca de Tiempo, Opcional): La fecha y hora en que el registro del pago fue actualizado por última vez.
- `deleted_at` (Marca de Tiempo, Opcional): La fecha y hora en que el registro del pago fue eliminado lógicamente del sistema.

### Ciclo de Vida

Un registro de `Pago` se crea típicamente de forma automática cuando se activa un `Contrato` o de manera mensual según los términos del contrato. Su estado comienza como 'due'. Una vez que se genera la `Factura` correspondiente, se puebla el `invoice_id`. El estado cambia a 'paid' cuando se registra el pago (aunque el procesamiento de pagos está fuera del alcance de la V1.0). El estado también puede pasar a ser 'overdue' si la `due_date` pasa sin que se registre el pago, o 'cancelled' si el contrato asociado se finaliza prematuramente o el pago ya no es requerido.

Esto incluye la cancelación como resultado de que el Contrato asociado sea cancelado debido a la eliminación lógica del Propietario o Inquilino vinculado.

### 🔁 Casos de Uso Relacionados
 - [[📄 CasosDeUso/CU06_facturacion_automatica.md]]
- [[📄 CasosDeUso/CU08_resumen_historial.md]]

### 🧑‍💻 User Stories Relacionadas
 - [[🧑‍💻 UserStories/US14_generar_factura_automaticamente.md]]
- [[🧑‍💻 UserStories/US19_listar_facturas_propietario.md]]
- [[🧑‍💻 UserStories/US18_reporte_financiero.md]]

### 👥 Roles Relacionados
 - [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/contador.md]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/factura]]
- [[🏠 Entidades/contrato]]
- [[🏠 Entidades/propiedad]]
