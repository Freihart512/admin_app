# US44

## Desactivar propiedad (Admin)

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]

Como **Admin**, quiero poder marcar una propiedad como inactiva (eliminar lógicamente) en el sistema, incluso si tiene un contrato activo, para reflejar con precisión su estado en el mundo real cuando ya no se gestiona o está disponible a través de la plataforma, y asegurar que esto desencadene las acciones en cascada necesarias.

### Actor

Admin

### Objetivo

Permitir al administrador desactivar lógicamente una [[🏠 Entidades/propiedad.md|Entidad Propiedad]] existente, gestionando correctamente las implicaciones en cascada, especialmente cuando hay un contrato activo asociado.

### Proceso Backend:

El sistema, al recibir una solicitud de desactivación lógica de propiedad por parte de un administrador, debe:

1.  Validar la identidad del administrador que realiza la solicitud.
2.  Recibir el <CODE_BLOCK>property_id</CODE_BLOCK> de la propiedad a desactivar y, opcionalmente, una nota del administrador explicando la razón de la desactivación.
3.  Validar que la propiedad con el <CODE_BLOCK>property_id</CODE_BLOCK> especificado exista en el sistema y no esté ya eliminada lógicamente.
4.  **Transacción de Desactivación Lógica:** Iniciar una transacción a nivel técnico para garantizar la atomicidad de las operaciones.
5.  **Manejo de Contrato Activo:**
    *   Verificar si la propiedad tiene un [[🏠 Entidades/contrato.md|Contrato]] activo asociado.
    *   Si existe un contrato activo, el sistema debe **cancelar lógicamente** este contrato como parte de la misma transacción (invocando la lógica de cancelación de contrato, ver [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13]] y [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md|US39]] - aunque esta última se enfoca en propietario, la lógica de cancelación es similar). Esto implica la cancelación de futuros pagos y la detención de generación de facturas futuras.
6.  Marcar el registro de la [[🏠 Entidades/propiedad.md|Entidad Propiedad]] con la marca de tiempo de eliminación lógica (<CODE_BLOCK>deleted_at</CODE_BLOCK>).
7.  Si se proporcionó una nota del administrador, asociar esta nota a la acción (posiblemente registrándola en el Log o en un campo específico de la propiedad si aplica).
8.  **Finalizar Transacción:** Si todas las operaciones dentro de la transacción (marcar propiedad, cancelar contrato si aplica) son exitosas, confirmar la transacción. Si alguna falla, revertir toda la transacción.
9.  Tras la desactivación lógica exitosa de la propiedad, el sistema debe generar un <CODE_BLOCK>Evento</CODE> de tipo 'Propiedad Desactivada por Admin' (ver [[🏠 Entidades/evento.md|Entidad Evento]]).
10. El sistema debe generar un registro en el [[🏠 Entidades/log.md|Log]] para esta acción administrativa, detallando el administrador que la realizó, la entidad Propiedad afectada, y la nota del administrador si se proporcionó (ver [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10]]).
11. El <CODE_BLOCK>Evento</CODE> 'Propiedad Desactivada por Admin' debe desencadenar [[🏠 Entidades/notificacion.md|Notificacion]]es (ver [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07]]) para el propietario asociado a la propiedad, el inquilino del contrato cancelado (si aplica), todos los administradores, y el contador asociado al propietario (si existe).

### Criterios de Aceptación

- CA01: El sistema permite a un administrador iniciar el proceso de desactivación lógica de una propiedad existente.
- CA02: El administrador puede (opcionalmente) proporcionar una nota explicando la razón de la desactivación.
- CA03: La desactivación lógica de la propiedad es una operación transaccional que incluye la cancelación de cualquier contrato activo asociado.
- CA04: Si la propiedad tiene un contrato activo, el sistema intenta cancelar lógicamente ese contrato como parte de la transacción.
- CA05: Si alguna parte de la transacción de desactivación (marcar propiedad, cancelar contrato) falla, toda la transacción se revierte, y la propiedad y el contrato mantienen su estado original.
- CA06: Si la transacción es exitosa, el campo <CODE_BLOCK>deleted_at</CODE_BLOCK> de la propiedad se actualiza.
- CA07: Si se proporcionó una nota, esta se asocia a la acción en el Log o registro correspondiente.
- CA08: La desactivación exitosa genera un <CODE_BLOCK>Evento</CODE_BLOCK> 'Propiedad Desactivada por Admin'.
- CA09: Un registro de log detallado se crea para la acción, incluyendo quién la realizó y la nota del administrador.
- CA10: Notificaciones se envían al propietario, inquilino (si aplica), administradores y contador asociado.
- CA11: La propiedad desactivada ya no aparece en las listas activas para la creación de nuevos contratos.

---

### 📎 Enlaces relacionados
- [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]
- [[🏠 Entidades/propiedad.md]]
- [[👥 Usuarios/admin.md]]
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/contrato.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/contador.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/eventos_del_sistema.md]]
- [[🏠 Entidades/notificacion.md]]
- [[📄 CasosDeUso/CU07_notificaciones_email.md]]
- [[🏠 Entidades/log.md]]
- [[📄 CasosDeUso/CU10_logs_y_errores.md]]
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md]]
- [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md]] (Lógica de cancelación en cascada)

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]] (Propietario de la propiedad)
- [[👥 Usuarios/inquilino.md]] (Inquilino del contrato cancelado)
- [[👥 Usuarios/contador.md]] (Asociado al propietario)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad.md]]
- [[👥 Usuarios/admin.md]] (Rol, aunque la entidad es Usuario)
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/contrato.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/contador.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/notificacion.md]]
- [[🏠 Entidades/log.md]]
