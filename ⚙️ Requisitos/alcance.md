## 📦 Alcance de la Plataforma de Administración de Propiedades en Renta (Backend V1.0)

Este documento establece el alcance de la versión 1.0 del **Backend** de la Plataforma de Administración de Propiedades en Renta con Facturación Automatizada. Define las funcionalidades clave a nivel de lógica de negocio y gestión de datos que serán incluidas y excluidas en esta fase inicial del proyecto, sentando las bases para futuras integraciones con interfaces de usuario.

**Incluye:**

*   **Gestión Completa de Datos (Backend):** Soporte a nivel de backend para la administración de información detallada de múltiples propiedades, contratos de arrendamiento, inquilinos, propietarios y contadores. Esto implica la definición de modelos de datos, APIs para la manipulación de la información (CRUD), y la lógica de negocio asociada.
*   **Facturación Automatizada e Integración con SW Sapien (Backend):** Implementación de la lógica de backend para la generación automática de facturas para los contratos activos, considerando las fechas de vencimiento (`due_date`). Integración segura a nivel de backend con la API de SW Sapien para el timbrado y gestión de las facturas generadas.
*   **Sistema de Notificaciones por Correo Electrónico (Backend):** Desarrollo de la lógica de backend para el envío automático de notificaciones por correo electrónico a inquilinos, propietarios y contadores en eventos clave (ej. generación de factura, próximo vencimiento de pago). Esto incluirá la integración con un servicio de envío de correos y la gestión de plantillas de notificación.
*   **Lógica de Backend para Dashboards:** Desarrollo de la lógica de backend necesaria para proporcionar los datos a futuros dashboards.
    *   **Panel de Propietario (Backend Data):** Endpoint y lógica de backend para proporcionar a un futuro frontend la lista de propiedades de un propietario, sus estados (`rentada` o `vacía`), y los contratos activos asociados con detalles clave como el nombre del inquilino y la fecha del próximo pago (`due_date`).
    *   **Panel de Administración Global (Backend Data):** Endpoint y lógica de backend para proporcionar a un futuro frontend una vista global de todas las propiedades, contratos, usuarios (propietarios, inquilinos, contadores), facturas, etc., permitiendo la gestión completa de datos por parte de un administrador.
*   **Historial de Propiedades (Backend Data):** Implementación de la lógica de backend para el registro y consulta del historial de estados y eventos relevantes de cada propiedad.

**Excluye:**

*   **Cualquier Interfaz de Usuario (Frontend):** La versión 1.0 se centra exclusivamente en el desarrollo del backend. No se incluye el diseño ni la implementación de interfaces de usuario (web, móvil, etc.).
*   **Pagos en Línea:** El backend no incluirá lógica para procesar pagos en línea en esta versión. La gestión de pagos se realizará externamente a través de la facturación y los acuerdos entre las partes.
*   **Aplicación Móvil Nativa:** No se contempla el desarrollo del backend específico para una aplicación móvil nativa en esta versión.

---

**Consideraciones Adicionales:**

Este alcance se define con el objetivo de construir un backend robusto y funcional que sirva como base sólida para futuras iteraciones que incluyan interfaces de usuario y funcionalidades adicionales. La implementación se enfocará en la eficiencia, seguridad y escalabilidad de los procesos de gestión de datos, facturación y notificación. Las funcionalidades relacionadas con el frontend y los pagos en línea podrán ser consideradas en futuras versiones del producto.