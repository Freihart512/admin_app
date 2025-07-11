## 7. ✅ Requisitos Funcionales

(Cubiertos por los Casos de Uso y User Stories anteriores)

---

## Resumen Consolidado de Requisitos Funcionales

Basado en los Casos de Uso (CU) y User Stories (US) detallados en otros documentos, los requisitos funcionales clave de la versión 1.0 del backend incluyen:

### Gestión de Usuarios y Entidades Principales

-   Gestionar propietarios (registrar, editar, desactivar con impacto en contratos y facturación).
-   [[📄 CasosDeUso/CU01_gestionar_propietarios]]
-   Gestionar propiedades (registrar, listar, buscar por propietario).
-   [[📄 CasosDeUso/CU02_gestionar_propiedades]]
-   Gestionar inquilinos (crear, editar, eliminar, listar).
-   [[📄 CasosDeUso/CU03_gestionar_inquilinos]]
-   Gestionar contadores (registrar, asociar a propietarios, editar datos de contacto).
-   [[📄 CasosDeUso/CU04_gestionar_contadores]]
-   Gestionar contratos (crear, editar, finalizar con impacto en la facturación).
-   [[📄 CasosDeUso/CU05_gestionar_contratos]]
-   Gestionar accesos y credenciales para usuarios propietarios.
-   [[📄 CasosDeUso/CU01_usuarios_y_accesos]]

### Facturación y Notificaciones

-   Generar facturas automáticamente para contratos activos en fechas definidas (primer día del mes).
-   [[📄 CasosDeUso/CU06_facturacion_automatica]]
-   Integrar con SW Sapien para el timbrado de facturas, utilizando la API Key por propietario.
-   [[📄 CasosDeUso/CU09_integracion_swsapien]]
-   Enviar notificaciones automáticas por email a inquilinos, propietarios y contadores sobre eventos clave (ej. generación de factura).
-   [[📄 CasosDeUso/CU07_notificaciones_email]]

### Consulta e Informes

-   Proporcionar datos de backend para paneles de visualización (Panel Propietario: lista de propiedades, estado, contratos activos; Panel de Administración Global: vista general de datos).
-   Permitir la consulta de resúmenes de ingresos y historial de facturación para propietarios.
-   Permitir la consulta de facturas por diversos criterios (propiedad, contrato, fecha) para administradores.
-   Registrar y permitir la verificación de logs de procesos automáticos y fallos del sistema (incluyendo fallos de integración con SW Sapien).
-   [[📄 CasosDeUso/CU08_resumen_historial]]
-   [[📄 CasosDeUso/CU10_logs_y_errores]]