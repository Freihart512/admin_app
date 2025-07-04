## 🏠 Entidades: Eventos del Sistema

Este documento lista y describe los diferentes tipos de eventos que se emiten y consumen dentro del backend del sistema, utilizando el mecanismo de Event Bus local. Define la interfaz de cada evento (aunque aquí se describe conceptualmente) y lista las User Stories emisoras y suscriptoras asociadas.

---

### Evento: `contrato.cancelado`
- **Descripción:** Emitido por el backend cuando un contrato activo es cancelado anticipadamente por un administrador (a través de US13). Como parte de este proceso, los pagos futuros asociados al contrato también son marcados como cancelados, lo cual **desencadena la emisión del evento `pago.cancelado`** por cada pago individual. Señala que el contrato ha pasado al estado 'cancelado'.
- **Payload Típico:** Un objeto JSON conteniendo al menos el identificador único del contrato cancelado (`contratoId`) y posiblemente otros datos relevantes como el `propietarioId`, `inquilinoId`, y la `fechaCancelacion`. El payload debe contener suficiente información para que los suscriptores puedan reaccionar sin necesidad de consultar inmediatamente la base de datos (aunque a menudo consultarán para obtener detalles completos).
- **Emisor(es):**
    - [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13: Cancelar contrato]]
- **Suscriptor(es):**
    - [[🧑‍💻 UserStories/US38_notificacion_cancelacion_contrato.md|US38: Notificación por email al cancelar contrato]]

---

### Evento: `propietario.desactivado`

- **Descripción:** Emitido por el backend cuando un propietario es marcado como desactivado (eliminación lógica) por un administrador.
- **Payload Típico:** Un objeto JSON conteniendo al menos el identificador único del propietario desactivado (`propietarioId`).
- **Emisor(es):**
    - [[🧑‍💻 UserStories/US02_editar_desactivar_propietario.md|US02: Editar o desactivar propietario]]
- **Suscriptor(es):**
    - [[🧑‍💻 UserStories/US39_cancelar_contratos_al_desactivar_propietario.md|US39: Cancelar contratos al desactivar propietario]]

---

### Evento: `pago.cancelado`

- **Descripción:** Emitido por el backend cuando un pago individual asociado a un contrato es marcado como cancelado. Esto ocurre típicamente cuando el contrato asociado es cancelado.
- **Payload Típico:** Un objeto JSON conteniendo al menos el identificador único del pago cancelado (`pagoId`) y el identificador del contrato asociado (`contratoId`).
- **Emisor(es):**
 - [[🧑‍💻 UserStories/US13_cancelar_contrato.md|US13: Cancelar contrato]]
- **Suscriptor(es):**
 - Componente de Facturación Automática (dentro de [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06: Facturación automática]]) (Omitirá la generación de facturas para los pagos cancelados).

---

### Evento: `inquilino.creado`

- **Descripción:** Emitido por el backend cuando un nuevo inquilino es creado exitosamente por un administrador.
- **Payload Típico:** Un objeto JSON conteniendo al menos el identificador único del inquilino creado (`inquilinoId`).
- **Emisor(es):**
    - [[🧑‍💻 UserStories/US07_crud_inquilinos_admin.md|US07: CRUD inquilinos admin]]
- **Suscriptor(es):**
    - [[🧑‍💻 UserStories/US40_enviar_notificacion_bienvenida_inquilino.md|US40: Enviar notificación de bienvenida a nuevo inquilino]]

<!-- Aquí se añadirán futuros eventos -->
---

### Evento: `contador.creado`

- **Descripción:** Emitido por el backend cuando un nuevo contador es registrado exitosamente por un administrador y asociado a uno o más propietarios.
- **Payload Típico:** Un objeto JSON conteniendo al menos el identificador único del contador creado (`contadorId`).
- **Emisor(es):**
    - [[🧑‍💻 UserStories/US09_registrar_nuevo_contador.md|US09: Registrar nuevo contador]]
- **Suscriptor(es):**
    - (Actualmente no hay suscriptores documentados, pero este evento está disponible para ser consumido por futuras funcionalidades).

<!-- Aquí se añadirán futuros eventos -->
---

### Evento: `contador.propietario.asociado`

- **Descripción:** Emitido por el backend cuando un administrador asocia un propietario adicional a un contador existente a través de la funcionalidad de edición de contador. Señala que el contador ahora tiene acceso a la información fiscal de las propiedades de este nuevo propietario.
- **Payload Típico:** Un objeto JSON conteniendo al menos el identificador único del contador (`contadorId`) y el identificador único del propietario que acaba de ser asociado (`propietarioId`).
- **Emisor(es):**
 - [[🧑‍💻 UserStories/US10_editar_contador.md|US10: Editar o cambiar datos de un contador]]
- **Suscriptor(es):**
 - [[🧑‍💻 UserStories/US42_notificacion_nueva_asociacion_contador.md|US42: Notificación al contador sobre nueva asociación de propietario]]

<!-- Aquí se añadirán futuros eventos -->

---

### Evento: `factura.generada`

- **Descripción:** Este evento se emite cada vez que el sistema genera automáticamente una factura para un contrato activo.
- **Emisor:** [[📄 CasosDeUso/CU06_facturacion_automatica.md|US14 - Generar factura automáticamente]].
- **Suscriptores:**
 * [[📄 CasosDeUso/CU07_notificaciones_email.md|CU07 - Envío de Notificaciones]] (para notificar al inquilino, propietario y contador).
 * [[📄 CasosDeUso/CU09_integracion_swsapien.md|CU09 - Integración con SW SAPien]] (para el timbrado de la factura).

<!-- Aquí se añadirán futuros eventos -->
