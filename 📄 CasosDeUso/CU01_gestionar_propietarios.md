### 🔸 CU01 - Gestionar propietarios

- El [[👥 Usuarios/admin|Administrador]] es el principal encargado de la gestión de la **Entidad Propietario**, incluyendo su registro, edición y desactivación. La gestión de la Entidad Propietario implica la creación o vinculación con una [[🏠 Entidades/usuario.md|Entidad Usuario]] existente que tendrá el rol 'propietario'. La vinculación se realiza utilizando el <CODE_BLOCK>user_id</CODE_BLOCK> como clave principal en la Entidad Propietario y clave foránea a la Entidad Usuario.
- El [[👥 Usuarios/propietario|Propietario]] accede a su propio panel para visualizar información relevante.

- [[🧑‍💻 UserStories/US01_registrar_nuevo_propietario]]: Registrar nuevo propietario
- [[🧑‍💻 UserStories/US02_editar_desactivar_propietario]]: Editar o desactivar propietario
- [[🧑‍💻 UserStories/US03_panel_propietario]]: Ver propiedades y contratos (Panel propietario) - Permite al Propietario visualizar sus propiedades y contratos asociados.
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad]]: Registrar nueva propiedad (realizado por o para un Propietario)
- [[🧑‍💻 UserStories/US05_listar_propiedades]]: Listar propiedades (relevante para Propietario)
- [[🧑‍💻 UserStories/US18_reporte_financiero]]: Reporte financiero (relevante para Propietario)
- [[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario]]: Enviar notificación de bienvenida a nuevo propietario

**Nota sobre Desactivación/Eliminación:** La desactivación o eliminación lógica de un propietario (cubierta por [[🧑‍💻 UserStories/US02_editar_desactivar_propietario|US02]]) desencadena la cancelación de sus contratos activos, lo que a su vez impacta en los pagos futuros y detiene la generación de facturas para esos contratos.
**Además, todas las propiedades asociadas a este propietario deben ser marcadas como desactivadas (eliminación lógica).**

---

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad.md|Propiedad]]
- [[🏠 Entidades/contrato]]
- [[🏠 Entidades/usuario]] - La entidad base para el Propietario.
- [[🏠 Entidades/notificacion]] - Recibidas por el propietario o el admin sobre eventos relacionados.

### 👥 Roles Relacionados
- [[👥 Usuarios/admin]]
- [[👥 Usuarios/propietario]]