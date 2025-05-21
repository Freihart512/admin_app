# US02

## Editar o desactivar propietario

**Caso de Uso:** [[📄 CasosDeUso/CU01_GESTIONAR_PROPIETARIOS]]

Como admin, quiero editar o desactivar propietarios existentes, para mantener datos actualizados.

**Detalles Backend:**
- Desactivar un propietario implica marcar el registro del propietario con una marca de tiempo (`deleted_at`).
- Esta acción debe **marcar todos los contratos activos asociados a este propietario y sus respectivos pagos como cancelados** (`cancelled` status).
- El backend debe **detener inmediatamente la generación de cualquier factura futura** para los contratos cancelados.
- El backend debe filtrar los propietarios desactivados en las listas activas y prevenir nuevas asociaciones con propiedades o contratos.