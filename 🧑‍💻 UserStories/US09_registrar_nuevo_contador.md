# US09

## Registrar contador

**Caso de Uso:** [[📄 CasosDeUso/CU04_gestionar_contadores.md]]

Como admin, quiero registrar un contador y asociarlo a uno o más propietarios, para que reciba notificaciones fiscales.

### Actor

Admin

### Objetivo

Proporcionar al administrador la capacidad de añadir nuevos contadores al sistema y vincularlos con los propietarios que representarán para la gestión de notificaciones fiscales.

### Criterios de Aceptación

- CA01: El administrador puede acceder a un formulario para registrar un nuevo contador.
- CA02: El formulario para crear un contador incluye campos para Nombre Completo, Correo Electrónico y cualquier otro dato relevante para el contacto y notificación.
- CA03: Los campos obligatorios para el registro del contador deben ser validados.
- CA04: El administrador puede seleccionar uno o más propietarios existentes para asociar al nuevo contador.
- CA05: El sistema guarda la información del nuevo contador y las asociaciones con propietarios correctamente.
- CA06: Tras un registro exitoso de un nuevo contador, el sistema debe emitir el evento `contador.creado` en el Event Bus local, incluyendo al menos el identificador único del contador creado (`contadorId`) en el payload.
- CA07: Si falta información obligatoria o los datos no son válidos durante la creación, el sistema muestra mensajes de error claros.

### Enlaces relacionados

- [[📄 CasosDeUso/CU04_gestionar_contadores.md|CU04: Gestionar contadores]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[👥 Usuarios/contador.md|Rol Contador]]
- [[👥 Usuarios/propietario.md|Rol Propietario]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]] (Emisor: `contador.creado`)
- [[🧑‍💻 UserStories/US10_editar_contador.md|US10: Editar o cambiar datos de un contador]] (US relacionada en el mismo CU)
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[👥 Usuarios/perfiles]]
