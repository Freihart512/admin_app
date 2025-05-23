## 11. 🔗 Dependencias

### Servicios Externos

- SW Sapien API Key por propietario
- SMTP o servicio de email (SendGrid, Mailgun)
- **Servicio de Envío de Correo Electrónico:** Para el envío automático de notificaciones por correo electrónico.
 - **Proveedor Seleccionado (Inicial):** Mailjet. Se utilizará Mailjet como servicio de envío de correo electrónico transaccional, aprovechando su nivel gratuito para las fases iniciales del proyecto.
 - **Consideraciones:** Se deberá integrar la lógica de backend con la API de Mailjet para el envío de correos. En caso de que el volumen de correos supere los límites del plan gratuito de Mailjet en el futuro, se evaluará la migración a un plan de pago superior de Mailjet o a otro proveedor de servicios de correo transaccional que se ajuste a las nuevas necesidades.

### Base de Datos

- **Base de datos PostgreSQL:** Se utilizará como sistema de gestión de base de datos relacional. PostgreSQL fue seleccionado por su robustez, fiabilidad y por ofrecer un sólido soporte para datos estructurados, lo cual es esencial para la gestión precisa de propiedades, contratos, inquilinos, propietarios y facturas.

### Tecnologías de Desarrollo

- Backend en TypeScript (NestJS + GraphQL)

### Infraestructura

- Infraestructura: Docker + Proxmox