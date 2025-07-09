### 🔸 CU04 - Gestionar la Entidad Contador y su Asociación con Propietarios

Este caso de uso abarca la gestión de la **Entidad Contador**, que representa a los contadores asociados en el sistema. La gestión implica la creación o vinculación de un registro en la Entidad Contador con una [[🏠 Entidades/usuario.md|Entidad Usuario]] existente o nueva a través del <CODE_BLOCK>user_id</CODE_BLOCK>, asegurando que dicho Usuario tenga el rol 'contador'. Adicionalmente, este CU cubre la **gestión de la asociación entre los Contadores y los Propietarios** a los que brindan servicio fiscal en el sistema.

- [[🧑‍💻 UserStories/US09_registrar_nuevo_contador.md|US09: Como admin, quiero registrar un contador y asociarlo a uno o más propietarios, para que reciba notificaciones fiscales.]]
- [[🧑‍💻 UserStories/US10_editar_contador.md|US10: Como admin, quiero editar o cambiar los datos de contacto de un contador, para mantenerlo actualizado.]]

---

### 📎 Enlaces relacionados
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[👥 Usuarios/perfiles]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/usuario.md|Entidad Usuario]] - La entidad base para los Contadores.
- [[👥 Usuarios/contador.md|Entidad Contador]] - La entidad de negocio gestionada en este CU.
- [[👥 Usuarios/propietario.md|Entidad Propietario]] - Entidad con la que los Contadores pueden asociarse.
- [[🏠 Entidades/factura.md|Entidad Factura]] - Los contadores pueden acceder a facturas de propietarios asociados.

### 👥 Roles Relacionados
- [[👥 Usuarios/admin.md]] - Principal responsable de la gestión de Contadores y sus asociaciones.
- [[👥 Usuarios/propietario.md]] - Puede estar asociado a un Contador.
- [[👥 Usuarios/contador.md]] - Rol gestionado en este CU.
