# US05

## Listar propiedades (Propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]

Como propietario, quiero ver un listado claro de todas mis propiedades y su información clave, incluyendo su estado actual, los detalles del contrato si está rentada, para gestionar mi portafolio de propiedades de manera efectiva.

### Actor

Propietario

### Objetivo

Permitir a un propietario visualizar de un vistazo todas las propiedades asociadas a su cuenta y obtener información relevante sobre su estado y contratos.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/propietario|propietario]] puede acceder a una sección o panel que muestra un listado de sus [[🏠 Entidades/propiedad|propiedades]].
- CA02: El listado muestra únicamente las [[🏠 Entidades/propiedad|propiedades]] asociadas al [[👤 Perfiles/propietario|propietario]] que ha iniciado sesión.
- CA03: Para cada [[🏠 Entidades/propiedad|propiedad]] en el listado, se muestra:
    - El Alias (si existe).
    - La Dirección completa.
    - El Estado de la [[🏠 Entidades/propiedad|propiedad]] (rentada o vacía).
- - CA04: Si una [[🏠 Entidades/propiedad|propiedad]] tiene un [[🏠 Entidades/contrato|contrato]] activo, el listado muestra información adicional relacionada con el [[🏠 Entidades/contrato|contrato]], incluyendo:
    - El Nombre Completo del [[👥 Usuarios/inquilino|inquilino]] asociado.
    - El Monto Mensual de Renta.
    - La Fecha de Fin del [[🏠 Entidades/contrato|contrato]].
    - El Estado del [[🏠 Entidades/contrato|contrato]] (ej. Activo, Próximo a vencer, Vencido).
🏠 Entidades/propiedad|propiedad]] no tiene un [[🏠 Entidades/contrato|contrato]] activo (estado 'vacía'), la información relacionada con el [[🏠 Entidades/contrato|contrato]] (Monto, Fecha Fin, Estado Contrato) no se muestra para esa propiedad.
- CA06: Si el [[👤 Perfiles/propietario|propietario]] no tiene [[🏠 Entidades/propiedad|propiedades]] registradas o asociadas, el sistema muestra un mensaje indicando que no hay propiedades para mostrar.
- CA07: El listado de propiedades está ordenado de manera lógica (ej. por Alias, Dirección, o fecha de registro).