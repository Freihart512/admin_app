## 🧑‍💻 User Story: US13 - Cancelar contrato

**Como** admin,
**Quiero** cancelar contratos,
**Para** terminar anticipadamente un acuerdo.

### Criterios de Aceptación (Backend)

CA01: El backend recibe una solicitud para cancelar un contrato específico (ej. identificado por su ID), iniciada por un usuario con rol de [[👤 Perfiles/administrador|Administrador]].
CA02: El backend verifica que el contrato con el ID proporcionado existe y está en un estado que permite la cancelación (ej. no está ya cancelado o finalizado).
CA03: El backend actualiza el estado del contrato a "Cancelado" y registra la fecha de cancelación.
CA04: El backend realiza cualquier otra acción necesaria relacionada con la cancelación, como ajustar el estado de [[🏠 Entidades/factura|facturas]] futuras asociadas a este contrato.
CA05: Al completar exitosamente la cancelación del contrato y las acciones relacionadas, el backend debe **emitir un evento** del tipo `contrato.cancelado` al Event Bus local. El payload de este evento debe incluir el ID del contrato cancelado y cualquier otra información necesaria para que los suscriptores reaccionen.
CA06: El backend retorna una respuesta exitosa a la interfaz de usuario indicando que el contrato ha sido cancelado.
CA07: Manejo de errores: Si el contrato no existe, no puede ser cancelado, o ocurre un error durante el proceso, el backend debe retornar una respuesta de error apropiada con un mensaje indicando el problema.

### Enlaces relacionados

- [[📄 CasosDeUso/CU05_gestionar_contratos.md|CU05: Gestionar contratos]]
- [[🏠 Entidades/contrato.md|Entidad Contrato]]
- [[🏠 Entidades/factura.md|Entidad Factura]]
- [[👤 Perfiles/administrador.md|Rol Administrador]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🧑‍💻 UserStories/US38_notificacion_cancelacion_contrato.md|US38: Notificación por email al cancelar contrato]] (Suscriptor del evento `contrato.cancelado`)
