# US03

## Ver propiedades y contratos (Panel propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU01_gestionar_propietarios]]

Como propietario, quiero acceder a un panel donde vea todas mis propiedades, sus estados y contratos activos.

**Detalles Backend:**
### Criterios de Aceptación

- CA01: El propietario puede navegar al panel de visualización de sus propiedades y contratos.
- CA02: El panel muestra una lista de todas las propiedades asociadas al propietario que ha iniciado sesión.
- CA03: Para cada propiedad listada, se muestra su dirección completa y su estado actual (ej. 'Rentada', 'Vacía').
- CA04: Para cada propiedad listada, se muestra una sección con los contratos que están actualmente activos.
- CA05: Si una propiedad no tiene contratos activos, esta sección se muestra vacía o no se muestra.
- CA06: Para cada contrato activo listado, se muestra el nombre completo del inquilino asociado.
- CA07: Para cada contrato activo listado, se muestra la fecha del próximo pago (`due_date`).
- CA08: Para cada contrato activo listado, se muestra su estado relevante (ej. 'Activo', 'Próximo a vencer').
- CA09: Si el propietario no tiene propiedades asociadas, el panel muestra un mensaje indicando que no hay propiedades para mostrar.

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario]]
