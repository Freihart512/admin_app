# US34

## Listar contratos (Propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como propietario, quiero ver un listado de los contratos de renta asociados a mis propiedades, para tener un resumen claro de mis acuerdos de arrendamiento vigentes e históricos.

### Actor

Propietario

### Objetivo

Permitir al propietario visualizar un listado de todos los contratos de renta que corresponden a las propiedades bajo su titularidad, con opciones básicas de filtrado y ordenación, para facilitar el seguimiento de sus acuerdos de arrendamiento.

### Criterios de Aceptación

- CA01: El [[👥 Usuarios/propietario|propietario]] puede acceder a una sección o página en el portal o aplicación que muestra un listado de [[🏠 Entidades/contrato|contratos]].
- CA02: El listado presentado al [[👥 Usuarios/propietario|propietario]] muestra **únicamente** los [[🏠 Entidades/contrato|contratos]] donde la [[🏠 Entidades/propiedad|propiedad]] asociada pertenece al [[👥 Usuarios/propietario|propietario]] que ha iniciado sesión. El sistema debe aplicar automáticamente este filtro basado en la identidad del usuario.
- CA03: El listado muestra para cada [[🏠 Entidades/contrato|contrato]] información clave relevante para el [[👥 Usuarios/propietario|propietario]], incluyendo al menos:
    - Identificador único del contrato.
    - [[🏠 Entidades/propiedad|Propiedad]] asociada (ej. Dirección completa o un identificador único de la propiedad).
    - [[👥 Usuarios/inquilino|Inquilino]] asociado (ej. Nombre Completo).
    - Fecha de Inicio del contrato.
    - Fecha de Fin del contrato.
    - Monto Mensual de Renta.
    - Estado actual del contrato ('activo', 'pendiente', 'finalizado', 'cancelado', etc.).
- CA04: El sistema proporciona opciones de búsqueda o filtros dentro del listado filtrado por propietario, permitiendo buscar contratos por [[🏠 Entidades/propiedad|Propiedad]] (ej. parte de la dirección), [[👥 Usuarios/inquilino|Inquilino]] (ej. parte del nombre), y/o Estado del contrato.
- CA05: El sistema permite ordenar el listado de contratos por columnas relevantes como Fecha de Inicio, Fecha de Fin o Estado.
- CA06: El listado debe ser eficiente y fácil de navegar para el [[👥 Usuarios/propietario|propietario]].
- CA07: Cada entrada en el listado debe incluir un enlace o un botón que permita al [[👥 Usuarios/propietario|propietario]] navegar a la vista de detalles completos de ese contrato específico (enlazando con la US para ver detalles del contrato por propietario - US35).
- CA08: Si el [[👥 Usuarios/propietario|propietario]] autenticado no tiene contratos asociados a ninguna de sus propiedades, o si los criterios de búsqueda/filtro no coinciden con ninguno de sus contratos, el sistema muestra un mensaje claro (ej. "No tiene contratos asociados a sus propiedades.") en lugar del listado vacío.
- CA09: Un [[👥 Usuarios/propietario|propietario]] no puede, bajo ninguna circunstancia, ver contratos asociados a propiedades que no le pertenecen.