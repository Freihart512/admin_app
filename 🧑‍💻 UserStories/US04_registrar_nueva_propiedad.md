# US04

## Registrar nueva propiedad (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]

Como admin, quiero registrar nuevas propiedades en el sistema, asociándolas a un propietario y proporcionando su dirección, un alias, y otras características, para poder gestionarlas eficientemente y prepararlas para renta.

### Actor

Admin

### Objetivo

Permitir al administrador crear una nueva propiedad en el sistema, capturando su información esencial y estableciendo su vínculo con un propietario existente.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/administrador|administrador]] puede acceder a un formulario para registrar una nueva [[🏠 Entidades/propiedad|propiedad]].
- CA02: El formulario incluye campos para: Seleccionar [[👤 Perfiles/propietario|Propietario]], Alias (opcional), Calle, Número Exterior, Número Interior (opcional), Colonia, Código Postal, Ciudad, Estado, y País.
- CA03: Los campos Seleccionar [[👤 Perfiles/propietario|Propietario]], Calle, Número Exterior, Colonia, Código Postal, Ciudad, Estado y País son obligatorios. El campo Alias es opcional.
- CA04: El sistema guarda la información de la nueva [[🏠 Entidades/propiedad|propiedad]] correctamente asociada al [[👤 Perfiles/propietario|propietario]] seleccionado por el [[👤 Perfiles/administrador|administrador]].
- CA05: Tras un registro exitoso, el sistema muestra un mensaje de confirmación al [[👤 Perfiles/administrador|administrador]].
- CA06: Si falta información obligatoria o los datos no son válidos, el sistema muestra mensajes de error claros indicando los campos a corregir.
- CA07: La nueva [[🏠 Entidades/propiedad|propiedad]] registrada aparece en el listado de propiedades del [[👤 Perfiles/propietario|propietario]] asociado (según [[🧑‍💻 UserStories/US05_listar_propiedades.md|US05]]) y en el listado/búsqueda de propiedades para el [[👤 Perfiles/administrador|administrador]] (según [[🧑‍💻 UserStories/US06_listar_propiedades_admin.md|US06]]).
