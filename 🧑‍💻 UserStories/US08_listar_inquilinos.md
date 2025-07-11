# US08

## Listar y buscar inquilinos (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]]

Como admin, quiero ver un listado de todos los inquilinos registrados en el sistema y tener la capacidad de filtrarlos o buscarlos por diferentes criterios, para poder localizar rápidamente a la persona que necesito gestionar o asociar a un contrato.

### Actor

Admin

### Objetivo

Permitir al administrador acceder a una vista general de todos los inquilinos, con funcionalidades de búsqueda y filtrado para facilitar la localization de un inquilino específico.

### Criterios de Aceptación

- CA01: El [[👥 Usuarios/admin.md|administrador]] puede acceder a una sección o página que muestra un listado de todos los [[👥 Usuarios/inquilino.md|inquilinos]] registrados en el sistema.
- CA02: Por defecto, el listado muestra solo los [[👥 Usuarios/inquilino.md|inquilinos]] que están activos (no han sido eliminados lógicamente, `deleted_at` es nulo).
- CA03: Para cada [[👥 Usuarios/inquilino.md|inquilino]] en el listado, se muestra la siguiente información clave:
    - Nombre Completo
    - Correo Electrónico
    - Número de Teléfono (si está registrado)
    - RFC (si está registrado)
    - **Estado:** Indica si el inquilino está 'activo' o 'eliminado lógicamente'.
- CA04: El sistema proporciona campos de búsqueda o filtros que permiten al [[👥 Usuarios/admin.md|administrador]] buscar inquilinos por Nombre Completo, Correo Electrónico y RFC.
- CA05: Al aplicar un filtro o realizar una búsqueda, el listado se actualiza dinámicamente para mostrar solo los [[👥 Usuarios/inquilino.md|inquilinos]] que coinciden con los criterios de búsqueda/filtrado.
- CA06: Si no hay [[👥 Usuarios/inquilino.md|inquilinos]] registrados en el sistema, o si una búsqueda/filtro no arroja resultados, el sistema muestra un mensaje claro indicando esta situación.
- CA07: El listado de inquilinos puede estar ordenado por defecto por un criterio lógico (ej. Nombre Completo ascendente).
- CA08: El [[👥 Usuarios/admin.md|administrador]] puede seleccionar un [[👥 Usuarios/inquilino.md|inquilino]] del listado para ver sus detalles completos o realizar acciones de edición/eliminación (según [[🧑‍💻 UserStories/US07_registrar_nuevo_inquilino.md|US07]]).
- CA09: El sistema permite al [[👥 Usuarios/admin.md|administrador]] visualizar [[👥 Usuarios/inquilino.md|inquilinos]] que han sido eliminados lógicamente (ej. mediante un filtro o una opción de visualización). Estos inquilinos eliminados lógicamente deben ser claramente diferenciados en el listado.

---

### 📎 Enlaces relacionados
- [[📄 CasosDeUso/CU03_gestionar_inquilinos.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/admin.md]]
- [[🧑‍💻 UserStories/US07_registrar_nuevo_inquilino.md]]
- [[🧑‍💻 UserStories/US31_listar_inquilinos_propietario.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]

### 🏠 Entidades Relacionadas
- [[👥 Usuarios/inquilino.md]]
