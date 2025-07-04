# US10

## Editar contador

### Actor

Admin

### Objetivo

Permitir al administrador modificar la información y las asociaciones de propietarios para un contador existente en el sistema.

**Caso de Uso:** [[📄 CasosDeUso/CU04_GESTIONAR_CONTADORES]]

Como admin, quiero editar o cambiar los datos de contacto de un contador, para mantenerlo actualizado.

### Criterios de Aceptación

- CA01: El administrador puede seleccionar un contador existente (ej. desde el listado de contadores) para editar su información.
- CA02: El sistema carga la información actual del contador seleccionado en un formulario de edición.
- CA03: El administrador puede modificar los campos como Nombre Completo, Correo Electrónico, y gestionar las asociaciones con propietarios.
- CA04: El sistema valida los campos modificados antes de guardar los cambios.
- CA05: El administrador puede añadir o remover propietarios asociados al contador.
- CA06: Si se añade un nuevo propietario a las asociaciones de un contador existente, el sistema debe emitir el evento `contador.propietario.asociado` en el Event Bus local, incluyendo los identificadores del contador y del propietario recién asociado en el payload.
- CA07: El sistema guarda los cambios realizados en la información y asociaciones del contador.
- CA08: Tras una edición exitosa, el sistema muestra un mensaje de confirmación y/o redirige al administrador.
- CA09: Si la información editada no es válida o si hay un error al guardar, el sistema muestra mensajes de error claros.

### Enlaces relacionados

- [[📄 CasosDeUso/CU04_gestionar_contadores.md|CU04: Gestionar contadores]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]]
- [[👥 Usuarios/contador.md|Rol Contador]]
- [[👥 Usuarios/propietario.md|Rol Propietario]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]] (Emisor: `contador.propietario.asociado`)
- [[🧑‍💻 UserStories/US09_registrar_nuevo_contador.md|US09: Registrar nuevo contador]] (US relacionada en el mismo CU)
- [[🧑‍💻 UserStories/US42_notificacion_nueva_asociacion_contador.md|US42: Notificación al contador sobre nueva asociación de propietario]] (Suscriptor del evento `contador.propietario.asociado`)
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[👥 Usuarios/perfiles]]