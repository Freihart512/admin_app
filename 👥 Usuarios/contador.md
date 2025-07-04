## Perfil: Contador

Persona encargada de la contabilidad de uno o más propietarios asociados en el sistema.

---

### 🔒 Permisos Detallados y Niveles de Acceso

El rol de Contador tiene permisos limitados, enfocados en la gestión fiscal de los propietarios asociados:

- **Ver [[🏠 Entidades/factura|factura]]s:** Acceso para visualizar las [[🏠 Entidades/factura|factura]]s generadas para los [[👥 Usuarios/propietario|propietario]]s a los que está asociado. **Importante: El acceso a las facturas está estrictamente restringido a aquellas de los propietarios asociados.**
- **Recibir [[🏠 Entidades/notificacion|notificación]]es:** Recibe [[🏠 Entidades/notificacion|notificación]]es por correo electrónico sobre la generación de nuevas [[🏠 Entidades/factura|factura]]s de los propietarios asociados.
- **Editar perfil propio:** Puede ver y editar sus propios datos de perfil dentro del sistema.
- **Acceso a [[🏠 Entidades/log|log]]s:** Puede ser registrado en los [[🏠 Entidades/log|log]]s por acciones como el inicio de sesión o el acceso a facturas.

### 🤝 Asociación con Propietario

Un Contador está asociado a uno o más [[👥 Usuarios/propietario|propietario]]s para fines de recepción de [[🏠 Entidades/notificacion|notificación]]es fiscales y acceso a [[🏠 Entidades/factura|factura]]s. En V1.0 del sistema, la relación entre un [[👥 Usuarios/propietario|propietario]] y un Contador es **uno a uno**: un propietario puede asociar a un único contador para recibir sus facturas. La asociación es típicamente configurada por el [[👥 Usuarios/admin|Admin]] o por el [[👥 Usuarios/propietario|propietario]] mismo (según [[🧑‍💻 UserStories/US09_CU04_gestionar_contadores|US09]]).

### 🎯 Necesidades y Objetivos Específicos

El principal objetivo del Contador es recibir de manera confiable la información fiscal (facturas) de los propietarios a los que representa. Necesitan recibir [[🏠 Entidades/notificacion|notificación]]es oportunas y tener un acceso sencillo para descargar o visualizar las [[🏠 Entidades/factura|factura]]s relevantes para realizar su trabajo de contabilidad externa. Buscan eficiencia en la recopilación de la información fiscal.

### 🔁 Casos de Uso relacionados
- [[📄 CasosDeUso/CU04_gestionar_contadores]]
- [[📄 CasosDeUso/CU07_notificaciones_email]]
- [[📄 CasosDeUso/CU08_resumen_historial]] (para ver facturas)

### 🧑‍💻 User Stories Relacionadas
- [[🧑‍💻 UserStories/US09_CU04_gestionar_contadores|US09: Como Propietario, quiero poder asociar un contador a mi perfil, para que reciba notificaciones de facturas fiscales.]]
- [[🧑‍💻 UserStories/US15_listar_facturas|US15: Como Propietario/Inquilino/Contador, quiero poder ver una lista de mis facturas, para mantener un registro de mis transacciones.]] (Alcance para Contador: Listar facturas de propietarios asociados)
- [[🧑‍💻 UserStories/US18_reporte_financiero|US18: Como Propietario/Contador, quiero poder acceder a un reporte financiero básico, para tener una visión general de mis ingresos/gastos.]] (Alcance para Contador: Reporte financiero basado en facturas de propietarios asociados)
- [[🧑‍💻 UserStories/US19_listar_facturas|US19: Como Propietario/Inquilino/Contador, quiero poder ver el detalle de una factura específica, para revisar la información completa de un cargo o pago.]] (Alcance para Contador: Ver detalle de facturas de propietarios asociados)
- [[🧑‍💻 UserStories/US20_listar_facturas_admin|US20: Como Administrador, quiero poder ver una lista de todas las facturas generadas en el sistema, para tener una visión completa de la actividad financiera.]] (Nota: Esta US es principalmente para Admin, aunque el Contador puede ver 'sus' facturas. Se mantiene la distinción)
- [[🧑‍💻 UserStories/US25_CU11_gestionar_accesos_y_credenciales|US25: Como Administrador/Usuario, quiero poder editar mis datos de acceso y perfil, para mantener mi información actualizada.]] (Alcance para Contador: Editar su propio perfil)

### 👥 Roles Relacionados
- [[👥 Usuarios/propietario]] (Rol con el que el Contador tiene una relación directa)
- [[👥 Usuarios/admin]] (Rol que puede gestionar la asociación Contador-Propietario)

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/factura]] (Entidad principal a la que accede)
- [[🏠 Entidades/usuario|Usuario]] (Entidad base para el rol Contador, y para el Propietario asociado)
- [[🏠 Entidades/notificacion|Notificación]] (Entidad que recibe)
- [[🏠 Entidades/log|Log]] (Entidad donde se registran sus acciones)
- [[👥 Usuarios/propietario|Propietario]] (Entidad de usuario con la que tiene relación directa)

### Propiedades del Sistema

- `accountant_id` (Unique Identifier)
- `user_id` (Foreign Key, if applicable)
- `full_name`
- `email`
- `phone_number` (Optional)
- `status`
- `created_at`
- `deleted_at` (Timestamp for soft deletion)