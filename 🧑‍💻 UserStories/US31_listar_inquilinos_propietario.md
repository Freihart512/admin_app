# US31

## Listar inquilinos (Propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]]

Como propietario, quiero ver un listado de los inquilinos asociados a mis propiedades (actuales y pasadas), para tener un registro de las personas con las que he tenido relaciones contractuales.

### Actor

Propietario

### Objetivo

Permitir a un propietario acceder a un listado de los inquilinos que han estado asociados a sus propiedades a través de contratos, para mantener un registro de sus relaciones contractuales.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/propietario|propietario]] puede acceder a una sección o página que muestra un listado de los [[👥 Usuarios/inquilino|inquilinos]] que han tenido o tienen [[🏠 Entidades/contrato|contratos]] con alguna de sus [[🏠 Entidades/propiedad|propiedades]].
- CA02: El listado muestra únicamente los [[👥 Usuarios/inquilino|inquilinos]] asociados al [[👤 Perfiles/propietario|propietario]] que ha iniciado sesión a través de [[🏠 Entidades/contrato|contratos]] históricos o activos.
- CA03: Para cada [[👥 Usuarios/inquilino|inquilino]] en el listado, se muestra la siguiente información:
    - Nombre Completo
    - Correo Electrónico
    - Número de Teléfono (si está registrado)
    - Una indicación clara de si el [[👥 Usuarios/inquilino|inquilino]] tiene actualmente un [[🏠 Entidades/contrato|contrato]] activo con alguna de las [[🏠 Entidades/propiedad|propiedades]] del propietario.
- CA04: El sistema proporciona campos de búsqueda o filtros que permiten al [[👤 Perfiles/propietario|propietario]] buscar inquilinos en su listado por Nombre Completo y Correo Electrónico.
- CA05: El sistema proporciona un filtro para mostrar únicamente los inquilinos que tienen un [[🏠 Entidades/contrato|contrato]] activo con el propietario, o todos los inquilinos asociados (activos y pasados).
- CA06: Al aplicar un filtro o realizar una búsqueda, el listado se actualiza dinámicamente para mostrar solo los [[👥 Usuarios/inquilino|inquilinos]] que coinciden con los criterios.
- CA07: Si el [[👤 Perfiles/propietario|propietario]] no tiene [[👥 Usuarios/inquilino|inquilinos]] asociados a sus propiedades a través de contratos, o si una búsqueda/filtro no arroja resultados, el sistema muestra un mensaje claro indicando esta situación.
- CA08: El listado de inquilinos puede estar ordenado por defecto por un criterio lógico (ej. Nombre Completo ascendente o por estado Activo/Pasado).
