### 🔸 CU02 - Gestionar propiedades

Este Caso de Uso describe las funcionalidades relacionadas con la **administración, registro, edición, y desactivación** de las propiedades en el sistema. El [[👥 Usuarios/propietario.md|Propietario]] puede registrar, listar y ver los detalles de sus propias propiedades, mientras que el [[👥 Usuarios/admin.md|Admin]] tiene capacidades adicionales como buscar propiedades por propietario y ver el historial completo de una propiedad, así como la capacidad exclusiva de **desactivar lógicamente** propiedades.

- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad.md|US04: Registrar nueva propiedad (Admin)]]
- [[🧑‍💻 UserStories/US29_registrar_propiedad_propietario.md|US29: Registrar propiedad (Propietario)]]
- [[🧑‍💻 UserStories/US43_editar_propiedad.md|US43: Editar propiedad]]
- [[🧑‍💻 UserStories/US44_desactivar_propiedad.md|US44: Desactivar propiedad (Admin)]]
- [[🧑‍💻 UserStories/US05_listar_propiedades.md|US05: Listar propiedades (Propietario)]]
- [[🧑‍💻 UserStories/US30_ver_detalles_propiedad_propietario.md|US30: Ver detalles de una propiedad (Propietario)]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin.md|US06: Listar propiedades (Admin)]]
- [[🧑‍💻 UserStories/US28_ver_historial_propiedad_admin.md|US28: Ver historial de propiedad (Admin)]]


### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]] (Indirectamente relacionado a través de contratos)

### 📎 Enlaces relacionados
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[📄 CasosDeUso/CU01_gestionar_propietarios.md|CU01: Gestionar propietarios]] (La gestión del propietario afecta a sus propiedades)
- [[📄 CasosDeUso/CU05_gestionar_contratos.md|CU05: Gestionar contratos]] (La gestión de contratos afecta el estado de la propiedad)
- [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10: Logs y errores]] (Acciones sobre propiedades se loguean)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad.md|Entidad Propiedad]]
- [[👥 Usuarios/propietario.md|Entidad Propietario]]
- [[🏠 Entidades/usuario.md|Entidad Usuario]] (Base para el propietario y admin)
- [[🏠 Entidades/contrato.md|Entidad Contrato]]
- [[👥 Usuarios/inquilino.md|Entidad Inquilino]]
- [[🏠 Entidades/log.md|Entidad Log]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
