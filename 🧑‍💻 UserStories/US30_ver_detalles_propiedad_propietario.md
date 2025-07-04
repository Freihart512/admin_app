# US30

## Ver detalles de propiedad (Propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]

Como propietario, quiero ver los detalles completos de una de mis propiedades, incluyendo toda su información, el contrato activo y los datos esenciales del inquilino si está rentada, para tener toda la información centralizada y accesible.

### Actor

Propietario

### Objetivo

Permitir a un propietario acceder a una vista detallada de una propiedad específica de su propiedad, consolidando toda la información relevante (propiedad, contrato activo, inquilino asociado).

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/propietario|propietario]] puede seleccionar una [[🏠 Entidades/propiedad|propiedad]] específica desde su listado de propiedades (según [[🧑‍💻 UserStories/US05_listar_propiedades.md|US05]]) o a través de otro mecanismo de selección para ver sus detalles.
- CA02: El sistema muestra una vista detallada con toda la información registrada para la [[🏠 Entidades/propiedad|propiedad]] seleccionada, incluyendo al menos:
    - El Alias (si existe).
    - La Dirección completa (Calle, Número Exterior/Interior, Colonia, Código Postal, Ciudad, Estado, País).
    - El Estado actual de la [[🏠 Entidades/propiedad|propiedad]] (rentada o vacía).
- CA03: Si la [[🏠 Entidades/propiedad|propiedad]] seleccionada tiene un [[🏠 Entidades/contrato|contrato]] activo:
    - El sistema muestra una sección claramente diferenciada con los detalles del [[🏠 Entidades/contrato|contrato]] activo.
    - Esta sección incluye la información del [[🏠 Entidades/contrato|contrato]] activo: Monto Mensual de Renta, Fecha de Inicio, Fecha de Fin, y Estado del [[🏠 Entidades/contrato|contrato]] (ej. Activo, Próximo a vencer, Vencido).
    - El sistema muestra la información del [[👥 Usuarios/inquilino|inquilino]] asociado a este [[🏠 Entidades/contrato|contrato]] activo, incluyendo: Nombre Completo, Correo Electrónico, y Número de Teléfono (si está registrado).
- CA04: Si la [[🏠 Entidades/propiedad|propiedad]] seleccionada no tiene un [[🏠 Entidades/contrato|contrato]] activo (estado 'vacía'), la sección de detalles del contrato e inquilino no se muestra o indica claramente que la propiedad está vacía.
- CA05: El propietario solo puede ver los detalles de las [[🏠 Entidades/propiedad|propiedades]] que le pertenecen. Si intenta acceder a los detalles de una propiedad que no es suya, el sistema lo impide y muestra un mensaje de error o redirige a una página apropiada.
- CA06: Si la [[🏠 Entidades/propiedad|propiedad]] seleccionada no se encuentra o no existe en el sistema, el sistema muestra un mensaje de error o redirige a una página de error/listado.
