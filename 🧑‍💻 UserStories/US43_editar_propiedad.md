# US43

## Editar propiedad

**Caso de Uso:** [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]

Como **Propietario** o **Admin**, quiero poder editar cierta información de una propiedad existente para mantener sus detalles actualizados en el sistema.

### Actores

Propietario, Admin

### Objetivo

Permitir a los usuarios autorizados modificar campos específicos de una [[🏠 Entidades/propiedad.md|Entidad Propiedad]] existente.

### Proceso Backend:

El sistema, al recibir una solicitud de edición de propiedad, debe:

1.  Validar la identidad del usuario que realiza la solicitud (Propietario o Admin).
2.  Recibir el <CODE_BLOCK>property_id</CODE_BLOCK> de la propiedad a editar y los datos a modificar (<CODE_BLOCK>alias</CODE_BLOCK>, opcionalmente <CODE_BLOCK>features</CODE_BLOCK>).
3.  Validar que la propiedad con el <CODE_BLOCK>property_id</CODE_BLOCK> especificado exista en el sistema y no esté eliminada lógicamente.
4.  **Autorización:**
    *   Si el usuario es un **Propietario**, validar que la propiedad pertenezca a él (comparando <CODE_BLOCK>owner_user_id</CODE_BLOCK> de la propiedad con el <CODE_BLOCK>user_id</CODE_BLOCK> del propietario autenticado).
    *   Si el usuario es un **Admin**, tiene permiso para editar cualquier propiedad.
5.  Validar que los datos proporcionados para la edición sean válidos (ej. formato, tipo de datos). Asegurar que solo los campos permitidos para edición ('alias', 'features') se intenten modificar a través de esta funcionalidad.
6.  Aplicar los cambios en los campos correspondientes de la [[🏠 Entidades/propiedad.md|Entidad Propiedad]] en la base de datos.
7.  Registrar la fecha y hora de actualización (<CODE_BLOCK>updated_at</CODE_BLOCK>).
8.  Tras la edición exitosa, el sistema debe generar un <CODE_BLOCK>Evento</CODE_BLOCK> de tipo 'Propiedad Actualizada' (ver [[🏠 Entidades/evento.md|Entidad Evento]]).
9.  El sistema debe generar un registro en el [[🏠 Entidades/log.md|Log]] para esta acción administrativa, detallando el usuario (Propietario o Admin) que la realizó, la entidad Propiedad afectada, y crucialmente, los **detalles de los campos modificados** (valores antiguos y nuevos) según lo especificado en el caso de uso [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10: Logs y Errores]].

### Criterios de Aceptación

- CA01: El sistema permite a un Propietario editar los campos <CODE_BLOCK>alias</CODE_BLOCK> y <CODE_BLOCK>features</CODE_BLOCK> de *sus* propiedades existentes y no eliminadas lógicamente.
- CA02: El sistema permite a un Admin editar los campos <CODE_BLOCK>alias</CODE_BLOCK> y <CODE_BLOCK>features</CODE_BLOCK> de *cualquier* propiedad existente y no eliminada lógicamente.
- CA03: El sistema rechaza solicitudes de edición de campos no permitidos ('alias', 'features') o de propiedades inexistentes/eliminadas.
- CA04: Si un Propietario intenta editar una propiedad que no le pertenece, el sistema rechaza la solicitud con un error de autorización.
- CA05: Los cambios en <CODE_BLOCK>alias</CODE> y <CODE_BLOCK>features</CODE> se guardan correctamente.
- CA06: La edición exitosa genera un <CODE_BLOCK>Evento</CODE_BLOCK> 'Propiedad Actualizada'.
- CA07: Un registro de log detallado se crea para la acción, incluyendo quién realizó la acción y los campos específicos que cambiaron con sus valores.

---

### 📎 Enlaces relacionados
- [[📄 CasosDeUso/CU02_gestionar_propiedades.md]]
- [[🏠 Entidades/propiedad.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/admin.md]]
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/eventos_del_sistema.md]]
- [[🏠 Entidades/log.md]]
- [[📄 CasosDeUso/CU10_logs_y_errores.md]]

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/admin.md]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad.md]]
- [[👥 Usuarios/propietario.md]]
- [[🏠 Entidades/admin.md]] (Referencia al rol, aunque la entidad es Usuario)
- [[🏠 Entidades/usuario.md]]
- [[🏠 Entidades/evento.md]]
- [[🏠 Entidades/log.md]]
