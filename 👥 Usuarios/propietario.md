## Perfil: Propietario

Persona que posee una o más propiedades en renta.

---

### 🔁 Casos de Uso relacionados
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU02_gestionar_propiedades]]
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU06_facturacion_automatica]]
- [[📄 CasosDeUso/CU08_resumen_historial]]
- [[📄 CasosDeUso/CU11_usuarios_y_accesos]]

---
### Proceso de Alta en el Sistema
### 🔒 Permisos Detallados y Niveles de Acceso

Los propietarios tienen acceso principalmente de solo lectura a la información relacionada con sus propiedades y contratos. Su acceso está **restringido a aquellas entidades (Propiedad, Contrato, Pago, Factura) con las que tienen una relación directa como dueños**. Los permisos incluyen:
- Ver la lista de sus [[🏠 Entidades/propiedad|propiedades]] y su estado.
- Acceder a resúmenes o paneles de sus [[🏠 Entidades/propiedad|propiedades]], [[🏠 Entidades/contrato|contratos]] y [[🏠 Entidades/contrato|contratos]] activos.
- Ver y descargar las [[🏠 Entidades/factura|facturas]] generadas para sus propiedades.
- Ver resúmenes de ingresos mensuales por [[🏠 Entidades/propiedad|propiedad]].
- Ver el historial de [[🏠 Entidades/factura|facturación]] por [[🏠 Entidades/contrato|contrato]].
- Gestionar sus propias credenciales de cuenta (cambiar contraseña, etc.).
- Capacidad de asociar, modificar y eliminar la asociación de un **único [[👥 Usuarios/contador|contador]] activo** a su cuenta. Este [[👥 Usuarios/contador|contador]] asociado tendrá acceso a todas las [[🏠 Entidades/factura|facturas]] del propietario para fines fiscales.
- **Al ser registrado por un [[👥 Usuarios/admin|administrador]] ([[🧑‍💻 UserStories/US01_registrar_nuevo_propietario|US01]]), el propietario recibe una notificación de bienvenida ([[🧑‍💻 UserStories/US27_enviar_notificacion_bienvenida_propietario|US27]]) que incluye la contraseña provisional para acceder al sistema.**

No tienen acceso a información de otros propietarios, propiedades que no les pertenecen, funcionalidades de administrador, ni la capacidad de crear, modificar o eliminar propiedades.

#### Funcionalidad: Asociar Contador
El propietario tiene la capacidad de asociar un único [[👥 Usuarios/contador|contador]] a su perfil. Esta funcionalidad permite que el [[👥 Usuarios/contador|contador]] designado reciba notificaciones y tenga acceso a las [[🏠 Entidades/factura|facturas]] fiscales del propietario. (Ver [[🧑‍💻 UserStories/US09_CU04_gestionar_contadores|US09]])

### 📋 Responsabilidades Clave

- Seguir el rendimiento financiero de sus [[🏠 Entidades/propiedad|propiedades]] a través de informes y [[🏠 Entidades/factura|facturas]].
- Gestionar la asociación de su único [[👥 Usuarios/contador|contador]] activo.
- Mantener la seguridad de su cuenta.

### 🤝 Interacciones con Otros Roles

Los propietarios interactúan activamente con el Sistema (viendo datos/informes, gestionando la asociación de su [[👥 Usuarios/contador|contador]]). Indirectamente interactúan con los Inquilinos a través de los [[🏠 Entidades/contrato|contratos]] y [[🏠 Entidades/factura|facturas]]. Directamente interactúan con su único [[👥 Usuarios/contador|contador]] asociado gestionando dicha asociación. El [[👥 Usuarios/admin|administrador]] gestiona la cuenta de usuario del propietario y las asociaciones iniciales de [[🏠 Entidades/propiedad|propiedades]].

### 🎯 Necesidades y Objetivos Específicos

Necesitan informes financieros claros y datos históricos para entender el rendimiento de su cartera de [[🏠 Entidades/propiedad|propiedades]]. Desean tener control sobre qué único [[👥 Usuarios/contador|contador]] puede acceder a toda su información financiera ([[🏠 Entidades/factura|facturas]]). La seguridad de la cuenta es importante. Su objetivo es comprender el rendimiento financiero de su portafolio y gestionar el acceso a su [[👥 Usuarios/contador|contador]] fiscal.

---

### 🗄️ Propiedades del Sistema

These are the key properties representing an Owner within the system:

- `rfc` (Unique Identifier / Primary Key): The RFC serves as the unique identifier for the owner.
- `user_id` (Foreign Key, optional): If owners are also considered a type of user in a general `users` table.
- `full_name`: The complete name of the owner(s).
- `email`: The email address for communication, notifications, and login.
- `phone_number` (Optional): A contact number.
- `status`: The status of the owner account (e.g., 'active', 'inactive').
- `properties_ids` (Relationship/Foreign Keys): A mechanism to link the owner to multiple properties they own (view-only access to these properties' data).
- `active_accountant_id` (Foreign Key, nullable): Links to the single active accountant associated with this owner.
- `created_at`: Timestamp for account creation.
- `deleted_at` (Timestamp): For soft deletion.
- `password_hash`: Hashed password for login.

---

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad]]
- [[🏠 Entidades/contrato]]
- [[🏠 Entidades/factura]]
- [[🏠 Entidades/pago]]
- [[🏠 Entidades/notificacion]]
- [[🏠 Entidades/log]]
- [[🏠 Entidades/usuario]]
---

### 📎 Enlaces relacionados

- [[🧑‍💻 UserStories/US01_CU01_gestionar_propietarios]]
- [[🧑‍💻 UserStories/US02_CU01_gestionar_propietarios]]
- [[🧑‍💻 UserStories/US03_panel_propietario]]
- [[🧑‍💻 UserStories/US04_registrar_nueva_propiedad]]
- [[🧑‍💻 UserStories/US05_listar_propiedades]]
- [[🧑‍💻 UserStories/US06_listar_propiedades_admin]]
- [[🧑‍💻 UserStories/US011_registrar_nuevo_contrato]]
- [[🧑‍💻 UserStories/US12_editar_contrato]]
- [[🧑‍💻 UserStories/US13_finalizar_contrato]]
- [[🧑‍💻 UserStories/US14_generar_factura_automaticamente]]
- [[🧑‍💻 UserStories/US15_listar_facturas]]
- [[🧑‍💻 UserStories/US18_reporte_financiero]]
- [[🧑‍💻 UserStories/US19_listar_facturas]]
- [[🧑‍💻 UserStories/US20_listar_facturas_admin]]
- [[🧑‍💻 UserStories/US25_registro_nuevo_usuario]]
- [[🧑‍💻 UserStories/US26_CU11_gestionar_accesos_y_credenciales]]