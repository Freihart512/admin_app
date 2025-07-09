# US14

## Generar Facturas Automaticamente

**Caso de Uso:** [[📄 CasosDeUso/CU06_facturacion_automatica.md]]

Como sistema, quiero generar automáticamente una factura en la fecha de cada uno de los pagos de cada contrato activo, usando los datos fiscales del propietario y del inquilino.

### Proceso Detallado de Generación:

1.  **Programación de Tarea (Job):** Al generar un nuevo <CODE_BLOCK>Pago</CODE_BLOCK> asociado a un contrato activo, el sistema debe programar una tarea (<CODE_BLOCK>job</CODE_BLOCK>) que se ejecutará automáticamente en la fecha de vencimiento (<CODE_BLOCK>due_date</CODE_BLOCK>) de dicho pago. Este <CODE_BLOCK>job</CODE_BLOCK> contendrá la información necesaria para identificar el pago, el contrato, el propietario y el inquilino.
2.  **Ejecución del Job e Intento de Facturación Externa:** En la fecha programada, el <CODE_BLOCK>job</CODE_BLOCK> se ejecuta. Recopila la información necesaria del contrato, propietario e inquilino e intenta generar la factura correspondiente a través de una integración con el sistema externo SW Sapien (ver [[📄 CasosDeUso/CU09_integracion_swsapien.md|CU09: Integración con SW Sapien]]).
3.  **Manejo de Fallos y Reintentos:**
    *   Si el intento inicial de comunicación o generación de la factura en SW Sapien falla, el sistema debe reintentar la operación hasta **3 veces adicionales**, con un intervalo de **2 horas** entre cada intento.
    *   **Emisión de Evento de Fallo Leve:** Cada fallo en el intento de generación (incluyendo el intento inicial y cada reintento) debe despachar un <CODE_BLOCK>Evento</CODE_BLOCK> de tipo 'Error de Facturación' (ver [[🏠 Entidades/evento.md|Entidad Evento]] y [[🏠 Entidades/eventos_del_sistema.md|Eventos del Sistema]]). Los detalles del fallo deben ser registrados en el <CODE_BLOCK>Log</CODE_BLOCK> (ver [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10: Logs y Errores]]). Las acciones desencadenadas por este evento (ej. notificaciones) se definen en otros casos de uso (ej. [[📄 CasosDeUso/CU07_notificaciones_email|CU07]]).
4.  **Fallo Crítico tras Reintentos:** Si después de efectuar todos los intentos de reintento, la factura no se genera exitosamente en SW Sapien, se considera un **fallo crítico**.
    *   El sistema generará un <CODE_BLOCK>Evento</CODE_BLOCK> de tipo 'Error Crítico de Facturación' (o similar, de alta prioridad) y registrará los detalles en el <CODE_BLOCK>Log</CODE>`. Las acciones desencadenadas (ej. alertas de alta prioridad para administradores) se definen en otros casos de uso (ej. [[🧑‍💻 UserStories/US24_US24_alerta_de_fallo_factura.md|US24]]).
5.  **Proceso Exitoso:** Si la factura se genera exitosamente en SW Sapien en cualquier intento, el proceso de generación es completado con éxito.
    *   El sistema genera un <CODE_BLOCK>Evento</CODE_BLOCK> de tipo 'Factura Generada Exitosamente'. Los detalles de la factura generada deben ser registrados (probablemente en la entidad <CODE_BLOCK>Factura</CODE_BLOCK>). Las acciones desencadenadas por este evento (ej. notificaciones a múltiples roles) se definen en otros casos de uso (ej. [[📄 CasosDeUso/CU07_notificaciones_email|CU07]]).
    *   El estado del <CODE_BLOCK>Pago</CODE_BLOCK> asociado se actualiza a '<CODE_BLOCK>invoiced</CODE_BLOCK>' (ver [[🏠 Entidades/pago.md|Entidad Pago]]).

---

### 📎 Enlaces relacionados

- [[📄 CasosDeUso/CU06_facturacion_automatica.md|CU06: Generar facturas automáticamente]]
- [[📄 CasosDeUso/CU09_integracion_swsapien.md|CU09: Integración con SW Sapien]]
- [[📄 CasosDeUso/CU07_notificaciones_email|CU07: Notificaciones Email]]
- [[📄 CasosDeUso/CU10_logs_y_errores.md|CU10: Logs y Errores]]
- [[🧑‍💻 UserStories/US24_US24_alerta_de_fallo_factura.md|US24: Alerta de fallo de factura]]
- [[🏠 Entidades/pago.md|Entidad Pago]]
- [[🏠 Entidades/factura.md|Entidad Factura]]
- [[🏠 Entidades/log.md|Entidad Log]]
- [[🏠 Entidades/notificacion.md|Entidad Notificación]]
- [[🏠 Entidades/evento.md|Entidad Evento]]
- [[🏠 Entidades/eventos_del_sistema.md|Eventos del Sistema]]

### 👥 Roles Relacionados

- [[👥 Usuarios/admin.md]]
- [[👥 Usuarios/propietario.md]]
- [[👥 Usuarios/inquilino.md]]
- [[👥 Usuarios/contador.md]]
