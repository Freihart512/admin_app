# US28

## Ver historial de propiedad (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades]]

Como admin, quiero ver el historial completo de una propiedad específica, para entender su ciclo de vida y auditar sus cambios.

### Actor

Admin

### Objetivo

Proporcionar al administrador una vista cronológica de los eventos y cambios clave relacionados con una propiedad.

### Criterios de Aceptación

- CA01: El administrador puede seleccionar una [[🏠 Entidades/propiedad|propiedad]] existente desde un listado o búsqueda para ver su historial.
- CA02: El sistema muestra un registro cronológico de los eventos clave asociados a la [[🏠 Entidades/propiedad|propiedad]].
- CA03: El historial incluye, como mínimo: cambios de estado (vacía/rentada), fechas de inicio y fin de los [[🏠 Entidades/contrato|contratos]] asociados, y referencias a los [[🏠 Entidades/contrato|contratos]] anteriores.
- CA04: La información del historial es clara y fácil de leer para el administrador.
- CA05: Los elementos del historial están ordenados por fecha (el evento más reciente primero o último, a definir).
- CA06: El administrador puede navegar de un elemento del historial (ej. un contrato anterior) a los detalles de la entidad referenciada si aplica.
