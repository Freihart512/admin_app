## 8. 🔐 Requisitos No Funcionales

*   **Seguridad:**
    *   Implementar un mecanismo de autenticación seguro (como JWT o sesiones) para proteger el acceso a la API.
    *   Garantizar la autorización adecuada para que los usuarios (administradores, propietarios) solo puedan acceder a los datos y funcionalidades a los que tienen permiso.
    *   Asegurar la confidencialidad e integridad de los datos sensibles (información de propiedades, inquilinos, propietarios, datos fiscales).
    *   Implementar medidas para prevenir ataques comunes como inyección SQL, XSS, CSRF (considerando que es un backend, aunque la prevención se extiende al frontend, el diseño del backend debe ser robusto).
    *   Gestionar de forma segura las API keys y credenciales de integración con servicios externos (como SW Sapien).

*   **Rendimiento:**
    *   Las consultas para obtener listados de propiedades, contratos, facturas, etc., deben tener un tiempo de respuesta aceptable, incluso con un gran volumen de datos.
    *   El proceso de facturación automática debe ejecutarse de manera eficiente y completar la generación de facturas dentro de un plazo definido.
    *   La integración con la API de SW Sapien debe ser gestionada eficientemente para minimizar latencia y errores.
    *   La latencia en la emisión y entrega de eventos a través del **mecanismo de eventos interno (Event Bus local)** debe ser mínima para asegurar que los procesos dependientes (como el envío de notificaciones) se activen rápidamente.
    *   El procesamiento de cada tipo de evento por parte de los suscriptores debe ser eficiente y no causar cuellos de botella en el sistema.

*   **Disponibilidad:**
    *   El sistema debe estar disponible para la generación automática de facturas y envío de notificaciones en los tiempos programados.
    *   La API debe tener una alta disponibilidad para las operaciones de gestión de datos.
    *   El **mecanismo de eventos interno (Event Bus local)** debe ser fiable dentro del contexto del proceso del backend para garantizar la entrega de eventos críticos durante la operación normal del sistema.

*   **Escalabilidad:**
    *   El backend debe ser capaz de soportar un incremento significativo en el número de propiedades, contratos, usuarios y facturas sin degradar el rendimiento.
    *   La arquitectura debe permitir escalar horizontalmente los componentes clave si es necesario.
    *   Los componentes que actúan como suscriptores de eventos deben poder escalar independientemente para manejar picos en el volumen de eventos de los que dependen.

*   **Fiabilidad:**
    *   El proceso de facturación automática debe ser robusto y manejar errores (ej. fallos en la integración con SW Sapien, datos inconsistentes) sin detener completamente el proceso.
    *   Las notificaciones por correo electrónico deben tener un mecanismo de reintento en caso de fallos temporales en el servicio de correo.
    *   Los datos deben ser consistentes y precisos en todo momento.
    *   El **mecanismo de eventos interno** debe garantizar la entrega de eventos a los suscriptores activos dentro del mismo proceso. Se debe definir el comportamiento en caso de que un suscriptor falle al procesar un evento (ej. logging de error, reintento por el handler).
    *   Los suscriptores de eventos deben estar diseñados para ser idempotentes cuando se requiera una garantía de entrega 'at-least-once', para manejar la posible recepción duplicada del mismo evento sin causar efectos secundarios no deseados.
    *   Debe existir un mecanismo para registrar y alertar sobre fallos en el procesamiento de eventos por parte de los suscriptores.

*   **Auditabilidad:**
    *   Mantener logs detallados y auditables de todas las operaciones clave, especialmente aquellas relacionadas con la gestión de datos (creación, edición, eliminación de entidades), la facturación y las notificaciones.
    *   Los logs deben incluir información relevante como usuario que realizó la acción, fecha y hora, y detalles de la operación.
    *   El sistema debe registrar la emisión de eventos clave y los intentos de procesamiento por parte de los suscriptores, como parte de los logs auditables.

*   **Manejabilidad:**
    *   Facilitar la monitorización del rendimiento y los errores del sistema.
    *   Contar con un registro claro de errores (como ya se menciona en los requisitos funcionales) para facilitar el diagnóstico y la resolución de problemas.
    *   El despliegue y la configuración del backend deben ser relativamente sencillos.

*   **Soporte Multi-propietario:**
    *   El sistema debe estar diseñado para gestionar datos y operaciones de múltiples propietarios de forma aislada y segura.

*   **Integración Segura con SW Sapien:**
    *   Garantizar que la comunicación con la API de SW Sapien sea segura (ej. usando HTTPS) y que las credenciales sean manejadas de forma segura.
    *   Manejar adecuadamente las respuestas y errores de la API de SW Sapien.

*   **Documentación:**
    *   Contar con documentación clara y actualizada del API para facilitar futuras integraciones (aunque el frontend no está en el alcance inicial, la documentación del API es un requisito no funcional importante para la mantenibilidad y futuras fases).

---
