# US29

## Registrar propiedad (Propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades]]

Como propietario, quiero registrar mis nuevas propiedades con su dirección, características y datos fiscales, para poder ofrecerlas en alquiler.

### Actor

Propietario

### Objetivo

Permitir a un propietario añadir información completa sobre una nueva propiedad de su propiedad al sistema para su gestión y futura renta.

### Criterios de Aceptación

- CA01: El [[👤 Perfiles/propietario|propietario]] puede acceder a un formulario para registrar una nueva [[🏠 Entidades/propiedad|propiedad]].
- CA02: El formulario incluye campos para: Alias, Calle, Número Exterior, Número Interior (opcional), Colonia, Código Postal, Ciudad, Estado, y País.
- CA03: Los campos Alias, Calle, Número Exterior, Colonia, Código Postal, Ciudad, Estado y País son obligatorios.
- CA04: El sistema guarda la información de la nueva [[🏠 Entidades/propiedad|propiedad]] correctamente asociada al [[👤 Perfiles/propietario|propietario]] que realiza el registro.
- CA05: Tras un registro exitoso, el sistema muestra un mensaje de confirmación al [[👤 Perfiles/propietario|propietario]].
- CA06: Si falta información obligatoria o los datos no son válidos, el sistema muestra mensajes de error claros indicando los campos a corregir.
- CA07: La nueva [[🏠 Entidades/propiedad|propiedad]] registrada aparece en el listado de propiedades del [[👤 Perfiles/propietario|propietario]] (según [[🧑‍💻 UserStories/US05_listar_propiedades.md|US05]]).
