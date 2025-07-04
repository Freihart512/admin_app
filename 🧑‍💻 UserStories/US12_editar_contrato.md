# US12

## Editar contrato (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como admin, quiero editar contratos activos para actualizar el monto de renta y, si el contrato aún no ha iniciado, su fecha de inicio, para reflejar acuerdos modificados.

### Actor

Admin

### Objetivo

Permitir al administrador modificar ciertos términos de un contrato de renta existente y activo (o pendiente de inicio), específicamente el monto de renta y, bajo ciertas condiciones, la fecha de inicio, para mantener la información del contrato actualizada en el sistema y asegurar la correcta facturación futura.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/administrador|administrador]] puede acceder a la función de edición de un [[🏠 Entidades/contrato|contrato]] existente (ej. seleccionando desde un listado o desde la vista de detalles del contrato).
- CA02: El sistema permite la edición solo para [[🏠 Entidades/contrato|contratos]] con estado 'activo' o 'pendiente' (es decir, cuya Fecha de Fin no ha pasado o cuya Fecha de Inicio aún no ha llegado, respectivamente). No se pueden editar contratos 'finalizados' o 'archivados'.
- CA03: El sistema presenta los datos actuales del [[🏠 Entidades/contrato|contrato]] en un formulario de edición.
- CA04: Los campos **editables** son:
    - Monto Mensual de Renta.
    - Fecha de Inicio del contrato.
- CA05: Los campos de Selección de Propiedad, Selección de Inquilino y **Fecha de Fin** del contrato **NO son editables** una vez que el contrato ha sido creado.
- CA06: **Validación de Fecha de Inicio:** La Fecha de Inicio solo se puede editar si la fecha actual es **anterior** a la Fecha de Inicio actual del contrato. Una vez que la Fecha de Inicio ha pasado, este campo se muestra pero no es editable.
- CA07: **Validación de Monto:** El sistema valida que el Monto Mensual de Renta ingresado sea un valor numérico válido y positivo.
- CA08: Si se edita la Fecha de Inicio (antes de que haya pasado), el sistema **automáticamente recalcula y actualiza la Fecha de Fin** del contrato para que sea exactamente un año después de la nueva Fecha de Inicio.
- CA09: El sistema guarda los cambios en el [[🏠 Entidades/contrato|contrato]].
- CA10: Si se actualiza el Monto Mensual de Renta, este cambio debe afectar la generación de **futuras [[🏠 Entidades/factura|facturas]] y [[🏠 Entidades/pago|pagos]]** asociadas a este contrato a partir de la próxima fecha de facturación después de la edición.
- CA11: Si se actualiza la Fecha de Inicio (y por lo tanto la Fecha de Fin), esto debe afectar la generación de futuras [[🏠 Entidades/factura|facturas]] (iniciando/terminando en las nuevas fechas) y el estado del contrato si las nuevas fechas lo ameritan.
- CA12: Tras una edición exitosa, el sistema muestra un mensaje de confirmación (ej. "Contrato actualizado exitosamente") y/o redirige al [[👤 Perfiles/administrador|administrador]] a la vista de detalles del contrato.
- CA13: Si los datos de edición no son válidos (ej. monto no numérico), la Fecha de Inicio no se puede editar (CA06), o alguna otra validación falla, el sistema muestra mensajes de error claros y específicos.
