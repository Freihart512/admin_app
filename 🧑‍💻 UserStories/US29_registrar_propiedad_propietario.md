# US29

## Registrar propiedad (Propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]

Como **Propietario**, quiero registrar mis nuevas propiedades en el sistema proporcionando su dirección, un alias, y características, para poder ofrecerlas en alquiler.

### Actor

Propietario

### Objetivo

Permitir a un propietario añadir información completa sobre una nueva [[🏠 Entidades/propiedad.md|Entidad Propiedad]] de su propiedad al sistema para su gestión y futura renta.

### Proceso Backend:

El sistema, al recibir una solicitud de registro de propiedad por parte de un propietario autenticado, debe:

1.  Validar la identidad del propietario que realiza la solicitud, obteniendo su <CODE_BLOCK>user_id</CODE_BLOCK>.
2.  Recibir los datos necesarios para la nueva propiedad: <CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE_BLOCK>, y opcionalmente <CODE_BLOCK>features</CODE_BLOCK>.
3.  Validar que el propietario que realiza la solicitud esté activo en el sistema (ver [[👥 Usuarios/propietario.md|Entidad Propietario]] y [[🏠 Entidades/usuario.md|Entidad Usuario]]).
4.  Validar que los datos de la propiedad recibidos sean válidos (ej. campos obligatorios presentes, formato de dirección si aplica, unicidad si es un requisito).
5.  Crear un nuevo registro en la [[🏠 Entidades/propiedad.md|Entidad Propiedad]] con un <CODE_BLOCK>property_id</CODE_BLOCK> único generado por el sistema.
6.  Asociar la nueva propiedad al propietario que realizó la acción, poblando el campo <CODE_BLOCK>owner_user_id</CODE_BLOCK> con el <CODE_BLOCK>user_id</CODE_BLOCK> del propietario autenticado.
7.  Registrar los datos proporcionados (<CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE_BLOCK>, <CODE_BLOCK>features</CODE_BLOCK>) en los campos correspondientes de la entidad Propiedad.
8.  Establecer el estado inicial de la propiedad (<CODE_BLOCK>status</CODE_BLOCK>) como 'vacía'.
9.  Registrar la fecha y hora de creación (<CODE_BLOCK>created_at</CODE_BLOCK>).
10. Tras el registro exitoso, el sistema debe generar un <CODE_BLOCK>Evento</CODE_BLOCK> de tipo 'Propiedad Registrada por Propietario' (ver [[🏠 Entidades/evento.md|Entidad Evento]]).
11. El sistema debe generar un registro en el [[🏠 Entidades/log.md|Log]] para esta acción, detallando el usuario propietario que la realizó y la entidad Propiedad afectada (ver [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10]]).
12. El <CODE_BLOCK>Evento</CODE_BLOCK> 'Propiedad Registrada por Propietario' debe desencadenar [[🏠 Entidades/notificacion.md|Notificacion]]es (ver [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07]]) para el propietario que registró la propiedad, todos los administradores, y el contador asociado a ese propietario (si existe).

### Criterios de Aceptación

- CA01: El sistema permite a un propietario autenticado registrar una nueva propiedad proporcionando los datos de la propiedad (<CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE>`, <CODE_BLOCK>features</CODE_BLOCK> opcionales).
- CA02: El sistema valida que el propietario que realiza la acción esté activo. Si no, rechaza el registro.
- CA03: El sistema valida la presencia de campos obligatorios (<CODE_BLOCK>address</CODE_BLOCK>, <CODE_BLOCK>alias</CODE_BLOCK>) y la validez de los datos proporcionados. Si no, rechaza el registro con errores.
- CA04: Tras la validación, se crea un nuevo registro en la [[🏠 Entidades/propiedad.md|Entidad Propiedad]] con un <CODE_BLOCK>property_id</CODE_BLOCK> único y se asocia automáticamente al propietario autenticado (<CODE_BLOCK>owner_user_id</CODE_BLOCK>).
- CA05: La nueva propiedad se registra con <CODE_BLOCK>status</CODE_BLOCK> 'vacía'.
- CA06: El registro exitoso genera un <CODE_BLOCK>Evento</CODE_BLOCK> 'Propiedad Registrada por Propietario'.
- CA07: Un registro de log detallado se crea para la acción.
- CA08: Notificaciones se envían al propietario que registró, administradores y contador asociado.
- CA09: La nueva propiedad es visible en el listado de propiedades del propietario (según [[🧑‍💻 UserStories/US05_listar_propiedades.md|US05]]).

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
- [[👥 Usuarios/contador.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/admin.md]] (Reciben notificación)
- [[👥 Usuarios/contador.md]] (Asociado al propietario, recibe notificación)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad.md]]
- [[👥 Usuarios/propietario.md]]
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/log.md]]
- [[👥 Usuarios/contador.md]]
