# US11

## Registrar nuevo contrato (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como admin, quiero crear contratos entre una propiedad (ya asociada a un propietario) y un inquilino, para iniciar la facturación y poder registrar renovaciones de contratos existentes, vinculando el nuevo contrato al anterior sin afectarlo.

### Actor

Admin

### Objetivo

Permitir al administrador registrar un nuevo contrato de renta en el sistema, vinculando una propiedad y un inquilino, definiendo sus términos (fechas, monto), y opcionalmente marcándolo como una renovación de un contrato anterior, asegurando que el nuevo contrato inicie al día siguiente del vencimiento del anterior, para formalizar el acuerdo y activar procesos como la facturación.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/administrador|administrador]] puede acceder a un formulario para registrar un nuevo [[🏠 Entidades/contrato|contrato]].
- CA02: El formulario de creación de [[🏠 Entidades/contrato|contrato]] incluye los campos necesarios para definir los términos del contrato, incluyendo al menos:
    - Selección de la [[🏠 Entidades/propiedad|propiedad]] a la que aplica el contrato.
    - Selección del [[👥 Usuarios/inquilino|inquilino]] asociado al contrato.
    - Fecha de Inicio del contrato.
    - Fecha de Fin del contrato.
    - Monto Mensual de Renta.
    - Una opción para indicar si este es una renovación de un contrato anterior.
- CA03: Los campos Selección de Propiedad, Selección de Inquilino, Fecha de Inicio, Fecha de Fin y Monto Mensual de Renta son obligatorios al crear un [[🏠 Entidades/contrato|contrato]].
- CA04: El sistema permite al [[👤 Perfiles/administrador|administrador]] buscar y seleccionar una [[🏠 Entidades/propiedad|propiedad]] existente y un [[👥 Usuarios/inquilino|inquilino]] existente para vincular al contrato.
- CA05: El sistema valida que la Fecha de Fin del contrato sea posterior a la Fecha de Inicio.
- CA06: **Validación clave de no superposición:** El sistema impide guardar el contrato si la [[🏠 Entidades/propiedad|propiedad]] seleccionada ya tiene otro [[🏠 Entidades/contrato|contrato]] activo cuyas fechas se superpongan total o parcialmente con las fechas del nuevo contrato que se intenta registrar. Esta validación aplica tanto a contratos nuevos como a renovaciones, excepto que para renovaciones se espera que el contrato anterior ya esté finalizado o a punto de finalizar *justo antes* del inicio del nuevo.
- CA07: Si se marca la opción de "renovación" (en CA02):
    - Se habilita un campo para seleccionar el contrato anterior que está siendo renovado.
    - El sistema permite buscar y seleccionar un contrato anterior válido para la misma [[🏠 Entidades/propiedad|propiedad]] y [[👥 Usuarios/inquilino|inquilino]].
    - **Validación clave de renovación:** El sistema valida que la Fecha de Inicio del nuevo contrato sea **exactamente el día siguiente** a la Fecha de Fin del contrato anterior seleccionado. Si no coincide, se muestra un mensaje de error.
    - Al guardar, el nuevo contrato queda vinculado al contrato anterior como su renovación (sin modificar el estado o datos del contrato anterior).
- CA08: El sistema guarda el nuevo [[🏠 Entidades/contrato|contrato]] con la información proporcionada y el estado inicial apropiado (ej. 'activo' si la fecha de inicio es igual o anterior a hoy, o 'pendiente' si la fecha de inicio es futura).
- CA09: Tras la creación exitosa de un [[🏠 Entidades/contrato|contrato]] con estado 'activo', el sistema activa automáticamente el proceso de facturación recurrente asociado a este contrato (generación de futuros [[🏠 Entidades/factura|facturas]] y [[🏠 Entidades/pago|pagos]]).
- CA09a: Tras la creación exitosa de un [[🏠 Entidades/contrato|contrato]] con estado 'activo', el sistema debe **emitir el evento `contrato.creado`** en el Event Bus local, incluyendo en el payload al menos el identificador único del contrato creado, y la información necesaria (ej. fechas, monto) para que el componente de facturación recurrente (suscriptor de este evento en [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06: Facturación automática]]) pueda programar la generación de futuras [[🏠 Entidades/factura|facturas]] y [[🏠 Entidades/pago|pagos]]) asociados a este contrato.
- CA10: Tras un registro exitoso, el sistema muestra un mensaje de confirmación (ej. "Contrato creado exitosamente") y/o redirige al [[👤 Perfiles/administrador|administrador]] a la vista de detalles del contrato o a un listado de contratos.
- CA11: Si falta información obligatoria, los datos no son válidos (ej. fechas incorrectas, monto no numérico), la propiedad ya está rentada en ese período (CA06), la validación de renovación falla (CA07), o el inquilino/propiedad seleccionados no existen, el sistema muestra mensajes de error claros y específicos.

### Enlaces relacionados

- [[📄 CasosDeUso/CU05_gestionar_contratos.md|CU05: Gestionar contratos]]
- [[🏠 Entidades/contrato.md|Entidad Contrato]]
- [[🏠 Entidades/propiedad.md|Entidad Propiedad]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[👥 Usuarios/inquilino.md|Rol Inquilino]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]] (Emisor: `contrato.creado`)
- [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06: Facturación automática]] (Suscriptor principal del evento `contrato.creado`)
- [[🧑‍💻 UserStories/US12_editar_contrato.md|US12: Editar contrato]] (US relacionada en el mismo CU)
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13: Cancelar contrato]] (US relacionada en el mismo CU)
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[👥 Usuarios/perfiles]]