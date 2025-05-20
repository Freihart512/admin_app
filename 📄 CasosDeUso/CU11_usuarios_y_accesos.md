### 🔸 CU11 - Gestionar accesos y credenciales

- US25: Como admin, quiero crear usuarios con rol de propietario, para que accedan a su panel.
- US26: Como propietario, quiero poder cambiar mi contraseña y datos de acceso, para mantener la seguridad.

---

## 7. ✅ Requisitos Funcionales

(Cubiertos por los Casos de Uso y User Stories anteriores)

---

## 8. 🔐 Requisitos No Funcionales

- Autenticación segura por usuario (JWT o sesiones)
- Soporte multi-propietario
- Logs auditables de procesos automáticos
- Integración segura con SW Sapien API
- Escalable en propiedades y contratos

---

## 9. 📦 Alcance Versión 1.0

**Incluye:**
- Soporte para múltiples propiedades y contratos
- Facturación automática con integración a SW Sapien
- Notificaciones por correo
- Dashboard básico de propietario

**Excluye:**
- Portal de inquilino
- Pagos en línea
- App móvil

---

## 10. 🗓️ Cronograma Tentativo

| Fase | Tareas | Tiempo estimado |
|------|--------|-----------------|
| 1. Dominio y modelo de datos | Propiedad, contrato, factura, usuario | 1 semana |
| 2. CRUD y GraphQL API         | CRUDs básicos y queries para dashboard | 1 semana |
| 3. Automatización mensual     | Cron job, lógica de generación | 1 semana |
| 4. Integración con SW Sapien  | Emisión real de facturas | 1 semana |
| 5. Notificaciones por correo  | Mailer + pruebas | 3 días |
| 6. Dashboard del propietario  | Frontend mínimo | 1 semana |

---

## 11. 🔗 Dependencias

- SW Sapien API Key por propietario
- SMTP o servicio de email (SendGrid, Mailgun)
- Base de datos PostgreSQL
- Backend en TypeScript (NestJS + GraphQL)
- Infraestructura: Docker + Proxmox

---

### 📎 Enlaces relacionados
- [[🧑‍💻 UserStories/todas_las_userstories]]
- [[👥 Usuarios/perfiles]]