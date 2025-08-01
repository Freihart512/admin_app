# Cambio de Contrasena

**Como:** [[Usuario]]
**Quiero:** Cambiar mi contraseña actual
**Para que:** Pueda asegurar mi cuenta con una nueva contraseña que solo yo conozco.

**Caso de Uso Padre:** [[Autenticacion_y_Acceso]]

**Criterios de Aceptación:**

*   **CA1:** Un [[Usuario]] autenticado debe poder acceder a una sección en la configuración de su perfil o cuenta donde pueda cambiar su contraseña.
*   **CA2:** La interfaz de cambio de contraseña debe solicitar al [[Usuario]] que ingrese su contraseña actual, la nueva contraseña y la confirmación de la nueva contraseña.
*   **CA3:** El sistema debe validar que la contraseña actual ingresada coincida con la contraseña registrada para el [[Usuario]] autenticado.
*   **CA4:** El sistema debe validar que la nueva contraseña y su confirmación coincidan.
*   **CA5:** El sistema debe validar que la nueva contraseña cumpla con los requisitos de seguridad (ej. longitud mínima, combinación de caracteres).
*   **CA6:** El sistema debe validar que la nueva contraseña no sea igual a la contraseña actual.
*   **CA7:** Si todas las validaciones son exitosas, el sistema debe actualizar la contraseña del [[Usuario]] con la nueva contraseña proporcionada.
*   **CA8:** Si el cambio de contraseña es exitoso, el sistema debe generar una **notificación interna** para el [[Usuario]] informándole que su contraseña ha sido cambiada exitosamente. **Nota V1.0: La notificación será visible dentro de la interfaz del usuario.**
*   **CA9:** El sistema debe notificar al [[Usuario]] en la interfaz si el cambio de contraseña fue exitoso o si falló, indicando los motivos en caso de fallo (ej. contraseña actual incorrecta, nueva contraseña no cumple requisitos).
*   **CA10:** El sistema debe registrar un evento en un historial de auditoría indicando que un [[Usuario]] autenticado intentó cambiar su contraseña, la fecha/hora, y el resultado de la operación (éxito o fallo), incluyendo detalles del fallo si aplica.

**Flujo Principal:**

1.  El [[Usuario]] inicia sesión en la plataforma.
2.  El [[Usuario]] navega a la sección de configuración de su cuenta/perfil (**CA1**).
3.  El [[Usuario]] selecciona la opción para cambiar contraseña.
4.  El sistema presenta la interfaz de cambio de contraseña (**CA2**).
5.  El [[Usuario]] ingresa su contraseña actual, la nueva contraseña y confirma la nueva contraseña.
6.  El [[Usuario]] envía el formulario.
7.  El sistema valida la contraseña actual (**CA3**), que la nueva contraseña y confirmación coincidan (**CA4**), que la nueva contraseña cumpla requisitos de seguridad (**CA5**), y que la nueva contraseña sea diferente a la actual (**CA6**).
8.  Si todas las validaciones son exitosas, el sistema actualiza la contraseña del [[Usuario]] (**CA7**).
9.  El sistema genera la notificación interna para el [[Usuario]] (**CA8**).
10. El sistema registra un evento de auditoría de éxito (**CA10**).
11. El sistema notifica al [[Usuario]] en la interfaz que el cambio fue exitoso (**CA9**).

**Flujos Alternativos/Excepciones:**

*   **Contraseña Actual Incorrecta:** Si la contraseña actual ingresada no coincide (**CA3**), el sistema muestra un mensaje de error. Se registra un evento de auditoría de fallo (**CA10**). El [[Usuario]] permanece en la interfaz.
*   **Nueva Contraseña y Confirmación No Coinciden:** Si la nueva contraseña y su confirmación no coinciden (**CA4**), el sistema muestra un mensaje de error. Se registra un evento de auditoría de fallo (**CA10**). El [[Usuario]] permanece en la interfaz.
*   **Nueva Contraseña No Cumple Requisitos de Seguridad:** Si la nueva contraseña no cumple los requisitos (**CA5**), el sistema muestra mensajes de error indicando qué reglas no se cumplen. Se registra un evento de auditoría de fallo (**CA10**). El [[Usuario]] permanece en la interfaz.
*   **Nueva Contraseña Igual a la Actual:** Si la nueva contraseña es igual a la contraseña actual (**CA6**), el sistema muestra un mensaje de error. Se registra un evento de auditoría de fallo (**CA10**). El [[Usuario]] permanece en la interfaz.
*   **Fallo al Actualizar la Contraseña en el Sistema:** En caso de un error interno del sistema al intentar actualizar la contraseña (**CA7**), el sistema debe registrar el error, mostrar un mensaje de error genérico al [[Usuario]], notificar al [[Usuario]] en la interfaz sobre el fallo (**CA9**), y registrar un evento de auditoría de fallo con detalles técnicos (**CA10**). La contraseña no se actualiza.
*   **Fallo al Generar Notificación Interna (CA8):** Si ocurre un error técnico al intentar generar la notificación interna, el sistema debe registrar el incidente, notificar al [[Usuario]] en la interfaz sobre el error específico (**CA9**), y registrar un evento de auditoría de fallo para la notificación (**CA10**). La operación principal de cambio de contraseña **sí** se completa si fue exitosa.
