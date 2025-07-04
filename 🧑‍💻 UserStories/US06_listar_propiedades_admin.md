# US06

## Listar y buscar propiedades (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades]]

Como admin, quiero poder listar y buscar propiedades por diversos criterios, para gestionar el sistema eficientemente.

### Actor

Admin

### Objetivo

Permitir al admin encontrar y visualizar propiedades específicas dentro del sistema utilizando diferentes filtros.

### Criterios de Aceptación

- CA01: El administrador puede acceder a una vista que muestra una lista de todas las [[🏠 Entidades/propiedad|propiedades]] del sistema por defecto.
- CA02: El administrador puede buscar o filtrar propiedades por el [[🏠 Entidades/usuario|propietario]] asociado (usando el nombre o ID del propietario).
- CA03: El administrador puede filtrar propiedades por el estado de la [[🏠 Entidades/propiedad|propiedad]] (rentada o vacía).
- CA04: El administrador puede buscar o filtrar propiedades basándose en el monto mensual de renta asociado a su [[🏠 Entidades/contrato|contrato]] activo (permitiendo rangos, valores exactos o comparación (mayor/menor)).
- CA05: En los resultados de la búsqueda o listado, para cada [[🏠 Entidades/propiedad|propiedad]], se muestra su **Alias (si existe)**, dirección, estado (rentada/vacía), el [[👤 Perfiles/propietario|propietario]] asociado, y si existe un [[🏠 Entidades/contrato|contrato]] activo, el estado de dicho [[🏠 Entidades/contrato|contrato]] (ej. activo, próximo a vencer, vencido).
- CA06: Si no hay [[🏠 Entidades/propiedad|propiedades]] que coincidan con los criterios de búsqueda/filtro, el sistema muestra un mensaje apropiado.
- CA07: El administrador puede aplicar múltiples criterios de búsqueda/filtro simultáneamente (ej. [[🏠 Entidades/propiedad|propiedades]] de un [[🏠 Entidades/usuario|propietario]] específico que estén rentadas y con renta mayor a X).
