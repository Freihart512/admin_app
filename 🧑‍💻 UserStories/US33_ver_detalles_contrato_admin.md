# US33

## Ver detalles de contrato (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como admin, quiero ver los detalles completos de un contrato específico, para revisar toda la información del acuerdo, su estado y acceder a acciones relacionadas.

### Actor

Admin

### Objetivo

Permitir al administrador visualizar en detalle toda la información de un contrato de renta seleccionado, incluyendo los datos de las entidades vinculadas (propiedad e inquilino) y tener acceso directo a las acciones de gestión del contrato.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/administrador|administrador]] puede acceder a la vista de detalles de un [[🏠 Entidades/contrato|contrato]] específico, generalmente haciendo clic en un enlace o botón desde el listado de contratos (US32), una búsqueda directa, o un enlace desde otra sección del sistema.
- CA02: La vista de detalles muestra toda la información completa y actualizada del [[🏠 Entidades/contrato|contrato]] seleccionado, incluyendo:
    - Identificador único del contrato.
    - [[🏠 Entidades/propiedad|Propiedad]] asociada (todos sus datos relevantes o un resumen detallado).
    - [[👥 Usuarios/inquilino|Inquilino]] asociado (todos sus datos relevantes o un resumen detallado).
    - Fecha de Inicio del contrato.
    - Fecha de Fin del contrato.
    - Monto Mensual de Renta.
    - Estado actual del contrato ('activo', 'pendiente', 'finalizado', 'cancelado', etc.).
    - Cualquier otro campo relevante de la entidad [[🏠 Entidades/contrato|Contrato]], como campos relacionados con la renovación (si aplica, mostrando un enlace o referencia al contrato anterior) o la fecha de cancelación (`cancelled_at`) si ha sido cancelado.
- CA03: La información de la [[🏠 Entidades/propiedad|Propiedad]] y el [[👥 Usuarios/inquilino|Inquilino]] mostrada en la vista de detalles debe ser interactiva o incluir enlaces explícitos que permitan al [[👤 Perfiles/administrador|administrador]] navegar fácilmente a las vistas de detalles completas correspondientes de la Propiedad y el Inquilino en sus respectivas secciones del sistema.
- CA04: Desde la vista de detalles del contrato, el [[👤 Perfiles/administrador|administrador]] tiene acceso a las acciones permitidas sobre el contrato en función de su estado actual. Esto incluye al menos:
    - Un botón o enlace "Editar Contrato" que redirige al formulario de edición del contrato (enlazando con US12), habilitado solo si el estado del contrato permite la edición (según US12).
    - Un botón o enlace "Cancelar Contrato" que inicia el proceso de cancelación del contrato (enlazando con US13), habilitado solo si el estado del contrato permite la cancelación (según US13).
    - (Otras acciones futuras como ver historial de pagos asociados, ver historial de cambios, etc., si se documentan en otras US).
- CA05: Si el identificador del contrato proporcionado para ver los detalles no corresponde a un contrato existente en el sistema, o si por algún motivo el [[👤 Perfiles/administrador|administrador]] no tuviera permisos (aunque para Admin se espera acceso total), el sistema muestra un mensaje de error apropiado (ej. "Contrato no encontrado") o redirige a una página de listado/error.
