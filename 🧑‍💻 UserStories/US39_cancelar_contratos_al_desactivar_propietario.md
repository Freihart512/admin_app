## 🧑‍💻 User Story: US39 - Cancelar contratos al desactivar propietario

**Como** sistema,
**Quiero** cancelar automáticamente todos los contratos activos asociados a un propietario,
**Para** asegurar que no se generen más facturas o se consideren pagos de contratos cuyo propietario ha sido desactivado.

### Criterios de Aceptación (Backend - Suscriptor de Evento)

CA01: Debe existir un componente o servicio en el backend que esté **suscrito al evento** `propietario.desactivado` en el Event Bus local.
CA02: Al recibir el evento `propietario.desactivado`, el componente suscriptor debe utilizar el ID del propietario proporcionado en el payload del evento para recuperar la lista de todos los contratos *activos* asociados a ese propietario.
CA03: Por cada contrato activo encontrado, el componente suscriptor debe invocar o utilizar la misma lógica de negocio implementada en la [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13: Cancelar contrato]] para proceder con la cancelación de dicho contrato. Esto asegura que se apliquen las mismas reglas (ej. actualización de estado, marcaje de pagos futuros).
CA04: El proceso debe manejar eficientemente múltiples contratos si un propietario tuviera varios.
CA05: Cualquier error durante la cancelación de un contrato individual (ej. contrato ya cancelado, error de base de datos) debe ser registrado, pero no debe detener el intento de cancelar otros contratos del mismo propietario.
CA06: Una vez completado el proceso para todos los contratos, el suscriptor registra el resultado (cuántos contratos se intentaron cancelar, cuántos exitosamente, cuántos fallaron).

### Enlaces relacionados

- [[📄 CasosDeUso/CU05_gestionar_contratos.md|CU05: Gestionar contratos]]
- [[🏠 Entidades/contrato.md|Entidad Contrato]]
- [[👥 Usuarios/propietario.md|Entidad Propietario]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Lista Completa de Eventos del Sistema]] (Emisor: `propietario.desactivado`)
- [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13: Cancelar contrato]] (Lógica invocada)
- [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md|US02: Editar o desactivar propietario]] (Emisor del evento `propietario.desactivado`)
