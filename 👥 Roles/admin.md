## Perfil: Admin

Persona encargada del sistema (setup, monitoreo, etc.).

---

### 🔒 Permisos Detallados y Niveles de Acceso
Los administradores poseen control total sobre el sistema. Esto incluye:
- **Gestión Completa de Datos:** Crear, leer, actualizar y eliminar información de todos los usuarios (propietarios, inquilinos, contadores), propiedades, contratos, facturas y cualquier otro dato dentro del sistema.
- **Configuración del Sistema:** Modificar ajustes globales, configuraciones de integraciones y parámetros operativos.
- **Gestión de Usuarios y Accesos:** Crear, modificar, desactivar y eliminar cuentas de usuario, así como gestionar roles y permisos.
### 📋 Responsabilidades Clave
- Administración y mantenimiento general del sistema.
- Gestión de usuarios y aseguramiento de la correcta asignación de roles.
- Monitoreo del rendimiento del sistema y solución de problemas técnicos.
- Gestión y supervisión de las integraciones con servicios externos (ej. SWSapien).
- Asegurar la integridad, seguridad y privacidad de los datos del sistema.
### 🤝 Interacciones con Otros Roles
Los administradores interactúan con todos los demás roles principalmente a través de la gestión de sus cuentas y datos dentro del sistema. Pueden tener interacciones directas con contadores o propietarios para resolver problemas específicos del sistema o solicitudes de información avanzada.
### 🎯 Necesidades y Objetivos Específicos
El principal objetivo del administrador es mantener el sistema funcionando de manera eficiente, segura y fiable para todos los usuarios. Necesitan una interfaz de administración completa e intuitiva que les permita realizar sus tareas de manera efectiva y resolver problemas rápidamente. Buscan la estabilidad del sistema y la satisfacción de los usuarios a través de un funcionamiento sin interrupciones.
---


### 🔁 Casos de Uso relacionados
- [[📄 CasosDeUso/CU01_gestionar_propietarios]]
- [[📄 CasosDeUso/CU02_gestionar_propiedades]]
- [[📄 CasosDeUso/CU03_gestionar_inquilinos]]
- [[📄 CasosDeUso/CU04_gestionar_contadores]]
- [[📄 CasosDeUso/CU05_gestionar_contratos]]
- [[📄 CasosDeUso/CU09_integracion_swsapien]]
- [[📄 CasosDeUso/CU10_logs_y_errores]]
- [[📄 CasosDeUso/CU01_usuarios_y_accesos]]

---

### 📊 Propiedades del Sistema
Las propiedades que representan a un administrador dentro del sistema son:
- `admin_id` (Identificador Único)
- `username` (o `email` para inicio de sesión)
- `email`
- `password_hash` (Versión segura y hasheada de la contraseña)
- `full_name` (Nombre completo del administrador)
- `phone_number` (Opcional: Número de teléfono de contacto)
- `status` (Estado de la cuenta, ej. 'activo', 'inactivo', 'suspendido')
- `created_at` (Fecha y hora de creación de la cuenta)
- `last_login_at` (Opcional: Fecha y hora del último inicio de sesión)
- `deleted_at` (Opcional: Marca de tiempo para borrado lógico)

### 🧑‍💻 User Stories Relacionadas


### 👥 Roles Relacionados
- [[👥 Usuarios/propietario]]
- [[👥 Usuarios/inquilino]]
- [[👥 Usuarios/contador]]

### 🏠 Entidades Relacionadas
- [[🏠 Entidades/propiedad]]
- [[🏠 Entidades/contrato]]
- [[🏠 Entidades/pago]]
- [[🏠 Entidades/factura]]
- [[🏠 Entidades/usuario]]
- [[🏠 Entidades/log]]
- [[🏠 Entidades/notificacion]]

---

