# US04

## Registrar nueva propiedad (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]

Como **Admin**, quiero registrar nuevas propiedades en el sistema, asociándolas a un propietario existente, y proporcionando su dirección, un alias, y características, para poder gestionarlas eficientemente y prepararlas para renta.

### Actor

Admin

### Objetivo

Permitir al administrador crear una nueva [[🏠 Entidades/propiedad.md|Entidad Propiedad]] en el sistema, capturando su información esencial y estableciendo su vínculo con un propietario existente y activo.

### Proceso Backend:

El sistema, al recibir una solicitud de registro de propiedad por parte de un administrador, debe:

1.  Validar la identidad del administrador que realiza la solicitud.
2.  Recibir los datos necesarios para la nueva propiedad: <CODE_BLOCK>owner_user_id</CODE_BLOCK> del propietario al que se asociará, <CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE_BLOCK>, y opcionalmente <CODE_BLOCK>features</CODE_BLOCK>.
3.  Validar que el propietario especificado por <CODE_BLOCK>owner_user_id</CODE_BLOCK> exista en el sistema y esté activo (ver [[👥 Usuarios/propietario.md|Entidad Propietario]] y [[🏠 Entidades/usuario.md|Entidad Usuario]]).
4.  Validar que los datos de la propiedad recibidos sean válidos (ej. campos obligatorios presentes, formato de dirección si aplica, unicidad si es un requisito).
5.  Crear un nuevo registro en la [[🏠 Entidades/propiedad.md|Entidad Propiedad]] con un <CODE_BLOCK>property_id</CODE_BLOCK> único generado por el sistema.
6.  Asociar la nueva propiedad al propietario especificado, poblando el campo <CODE_BLOCK>owner_user_id</CODE_BLOCK> con el <CODE_BLOCK>user_id</CODE_BLOCK> del propietario seleccionado.
7.  Registrar los datos proporcionados (<CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE_BLOCK>, <CODE_BLOCK>features</CODE_BLOCK>) en los campos correspondientes de la entidad Propiedad.
8.  Establecer el estado inicial de la propiedad (<CODE_BLOCK>status</CODE_BLOCK>) como 'vacía'.
9.  Registrar la fecha y hora de creación (<CODE_BLOCK>created_at</CODE_BLOCK>).
10. Tras el registro exitoso, el sistema debe generar un <CODE_BLOCK>Evento</CODE_BLOCK> de tipo 'Propiedad Registrada por Admin' (ver [[🏠 Entidades/evento.md|Entidad Evento]]).
11. El sistema debe generar un registro en el [[🏠 Entidades/log.md|Log]] para esta acción administrativa, detallando el administrador que la realizó y la entidad Propiedad afectada (ver [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10]]).
12. El <CODE_BLOCK>Evento</CODE_BLOCK> 'Propiedad Registrada por Admin' debe desencadenar [[🏠 Entidades/notificacion.md|Notificacion]]es (ver [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07]]) para el propietario asociado a la propiedad, todos los administradores, y el contador asociado a ese propietario (si existe).

### Criterios de Aceptación

- CA01: El sistema permite a un administrador registrar una nueva propiedad proporcionando el <CODE_BLOCK>owner_user_id</CODE_BLOCK> de un propietario existente y activo, junto con los datos de la propiedad (<CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE_BLOCK>, <CODE_BLOCK>features</CODE_BLOCK> opcionales).
- CA02: El sistema valida que el propietario especificado exista y esté activo. Si no, rechaza el registro y proporciona un error.
- CA03: El sistema valida la presencia de campos obligatorios (<CODE_BLOCK>owner_user_id</CODE_BLOCK>, <CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE_BLOCK>) y la validez de los datos proporcionados. Si no, rechaza el registro con errores.
- CA04: Tras la validación, se crea un nuevo registro en la [[🏠 Entidades/propiedad.md|Entidad Propiedad]] con un <CODE_BLOCK>property_id</CODE_BLOCK> único y se asocia al propietario correcto (<CODE_BLOCK>owner_user_id</CODE_BLOCK>).
- CA05: La nueva propiedad se registra con <CODE_BLOCK>status</CODE_BLOCK> 'vacía'.
- CA06: El registro exitoso genera un <CODE_BLOCK>Evento</CODE_BLOCK> 'Propiedad Registrada por Admin'.
- CA07: Un registro de log detallado se crea para la acción administrativa.
- CA08: Notificaciones se envían al propietario, administradores y contador asociado.
- CA09: La nueva propiedad es visible en las listas de propiedades relevantes (admin y propietario asociado).

---

### 📎 Enlaces relacionados
- [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]
- [[🏠 Entidades/propiedad.md]]
- [[👥 Usuarios/propietario.md]]
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/eventos_del_sistema.md]]
- [[🏠 Entidades/notificacion.md]]
- [[📄 CasosDeUso/CU07_notificaciones_email.md]]
- [[🏠 Entidades/log.md]]
- [[📄 CasosDeUso/CU10_logs_y_errores.md]]
- [[🧑‍💻 UserStories/US05_listar_propiedades.md]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin.md]]
- [[👥 Usuarios/contador.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]] (Asociado a la propiedad)
- [[👥 Usuarios/contador.md]] (Asociado al propietario, recibe notificación)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad.md]]
- [[👥 Usuarios/propietario.md]]
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/log.md]]
- [[👥 Usuarios/contador.md]]
