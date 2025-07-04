# US32

## Listar contratos (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como admin, quiero ver un listado filtrable de todos los contratos, para tener una visión general, encontrar contratos específicos y monitorear su estado.

### Actor

Admin

### Objetivo

Permitir al administrador del sistema visualizar un listado completo y organizado de todos los contratos de renta registrados, con opciones de búsqueda, filtro y ordenación, para facilitar su gestión y seguimiento.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/administrador|administrador]] puede acceder a una sección o página dedicada que muestra un listado de todos los [[🏠 Entidades/contrato|contratos]] registrados en el sistema.
- CA02: El listado muestra para cada [[🏠 Entidades/contrato|contrato]] información clave de forma clara y legible, incluyendo al menos:
    - Identificador único del contrato.
    - [[🏠 Entidades/propiedad|Propiedad]] asociada (ej. Dirección completa o un identificador único).
    - [[👥 Usuarios/inquilino|Inquilino]] asociado (ej. Nombre Completo).
    - Fecha de Inicio del contrato.
    - Fecha de Fin del contrato.
    - Monto Mensual de Renta.
    - Estado actual del contrato ('activo', 'pendiente', 'finalizado', 'cancelado', etc.).
- CA03: El sistema proporciona campos de búsqueda o filtros que permiten al [[👤 Perfiles/administrador|administrador]] refinar el listado. Los filtros deben incluir al menos la posibilidad de buscar por [[🏠 Entidades/propiedad|Propiedad]] (ej. parte de la dirección), [[👥 Usuarios/inquilino|Inquilino]] (ej. parte del nombre), y Estado del contrato.
- CA04: El sistema permite ordenar el listado de contratos por columnas relevantes, incluyendo al menos Fecha de Inicio, Fecha de Fin y Estado.
- CA05: El listado debe ser eficiente y manejable, utilizando paginación, carga progresiva o técnicas similares si el volumen de contratos es grande. La interfaz debe indicar el número total de contratos y la página actual si se usa paginación.
- CA06: Cada entrada en el listado de contratos (cada fila de contrato) debe incluir un enlace o un botón que permita al [[👤 Perfiles/administrador|administrador]] navegar a la vista de detalles completos de ese contrato específico (enlazando con la US para ver detalles del contrato).
- CA07: Si no hay contratos registrados en el sistema, o si los criterios de búsqueda/filtro no coinciden con ningún contrato, el sistema muestra un mensaje claro y amigable (ej. "No se encontraron contratos.") en lugar del listado.
