# Recuperacion de Contrasena

**Como:** [[Usuario]]
**Quiero:** Recuperar el acceso a mi cuenta si he olvidado mi contraseña
**Para que:** Pueda volver a iniciar sesión en la plataforma.

**Caso de Uso Padre:** [[Autenticacion_y_Acceso]]

**Criterios de Aceptación:**

*   **CA1:** La página de inicio de sesión debe incluir un enlace visible para iniciar el proceso de "Recuperación de Contraseña" (**CA7** en [[Inicio_de_Sesion]]).
*   **CA2:** Al hacer clic en el enlace de recuperación, el sistema debe redirigir al [[Usuario]] a una página o sección donde pueda solicitar la recuperación.
*   **CA3:** La interfaz de recuperación de contraseña debe solicitar al [[Usuario]] el correo electrónico asociado a su cuenta.
*   **CA4:** Al enviar el correo electrónico, el sistema debe validar que existe un [[Usuario]] activo con ese correo electrónico en la base de datos.
*   **CA5:** Si el correo electrónico es válido y corresponde a un [[Usuario]] activo, el sistema debe generar un token seguro de recuperación de contraseña con una fecha de expiración limitada.
*   **CA6:** El sistema debe generar una **notificación interna** para el [[Usuario]] informándole cómo proceder con la recuperación de su contraseña. Esta notificación debe incluir un enlace seguro que contenga el token generado en **CA5**. **Nota V1.0: El envío de correos electrónicos con el enlace de recuperación está fuera del alcance inicial. La notificación será visible dentro de la interfaz del usuario (por ejemplo, en una sección de notificaciones internas si la hay, o se debe indicar al administrador la generación del token y el enlace para que lo comunique al usuario). Definiremos mejor el mecanismo de notificación en V1.0.**
*   **CA7:** Si el correo electrónico proporcionado **no es válido** o **no corresponde a un [[Usuario]] activo**, el sistema debe mostrar un mensaje de confirmación genérico al [[Usuario]] en la interfaz (ej. "Si su correo electrónico existe en nuestra base de datos, recibirá instrucciones para restablecer su contraseña") sin revelar si el correo existe o no por seguridad.
*   **CA8:** El enlace de recuperación de contraseña (incluyendo el token) debe ser de un solo uso o tener una duración muy limitada. Una vez utilizado o expirado, ya no debe ser válido.
*   **CA9:** Al acceder al enlace de recuperación válido (**CA8**), el sistema debe presentar al [[Usuario]] una interfaz donde pueda establecer una nueva contraseña.
*   **CA10:** Al establecer la nueva contraseña, el sistema debe validar que cumpla con los requisitos de seguridad (ej. longitud mínima, combinación de caracteres).
*   **CA11:** Si la nueva contraseña es válida y se guarda correctamente, el sistema debe actualizar la contraseña del [[Usuario]] y marcar el token de recuperación como utilizado o inválido.
*   **CA12:** El sistema debe notificar al [[Usuario]] (a través de una notificación interna o mensaje en la interfaz) que su contraseña ha sido restablecida exitosamente.
*   **CA13:** El sistema debe registrar un evento en un historial de auditoría indicando que se intentó recuperar la contraseña para un correo electrónico, la fecha/hora, el resultado (solicitud exitosa/fallida, restablecimiento exitoso/fallido) y detalles si aplica (ej. correo no encontrado, token inválido, validación de contraseña fallida).

**Flujo Principal (Solicitud de Recuperación):**

1.  El [[Usuario]] accede a la página de inicio de sesión y selecciona "Recuperar Contraseña" (**CA1**).
2.  El sistema redirige a la página/sección de recuperación de contraseña (**CA2**).
3.  El [[Usuario]] ingresa su correo electrónico (**CA3**).
4.  El [[Usuario]] envía la solicitud.
5.  El sistema valida si existe un [[Usuario]] activo con ese correo electrónico (**CA4**).
6.  Si el correo es válido y activo, el sistema genera un token de recuperación (**CA5**).
7.  El sistema genera la notificación interna para el [[Usuario]] con el enlace de recuperación (**CA6**).
8.  El sistema muestra un mensaje de confirmación genérico al [[Usuario]] en la interfaz (**CA7**).
9.  El sistema registra un evento de auditoría de solicitud de recuperación exitosa (**CA13**).

**Flujo Alternativo (Correo No Encontrado o Inactivo):**

1.  (Pasos 1-5 del Flujo Principal) ...
2.  Si el correo electrónico **no** es válido o el [[Usuario]] **no** está activo (**CA4**), el sistema **no** genera token ni notificación de recuperación.
3.  El sistema muestra el mensaje de confirmación genérico al [[Usuario]] en la interfaz (**CA7**).
4.  El sistema registra un evento de auditoría de solicitud de recuperación fallida (motivo: correo no encontrado/inactivo) (**CA13**).

**Flujo Principal (Establecer Nueva Contraseña):**

1.  El [[Usuario]] accede al enlace de recuperación de contraseña desde la notificación interna.
2.  El sistema valida el token de recuperación (**CA8**).
3.  Si el token es válido, el sistema presenta una interfaz para establecer la nueva contraseña (**CA9**).
4.  El [[Usuario]] ingresa y confirma su nueva contraseña.
5.  El [[Usuario]] envía el formulario.
6.  El sistema valida la nueva contraseña (**CA10**).
7.  Si la validación es exitosa, el sistema actualiza la contraseña del [[Usuario]] y marca el token como inválido (**CA11**).
8.  El sistema genera una notificación interna para el [[Usuario]] confirmando el cambio de contraseña (**CA12**).
9.  El sistema registra un evento de auditoría de restablecimiento de contraseña exitoso (**CA13**).
10. El sistema puede redirigir al [[Usuario]] a la página de inicio de sesión.

**Flujos Alternativos/Excepciones (Establecer Nueva Contraseña):**

*   **Token Inválido o Expirado:** Si el [[Usuario]] accede con un token inválido o expirado (**CA8**), el sistema muestra un mensaje de error indicando que el enlace no es válido y se registra un evento de auditoría de fallo (**CA13**). El [[Usuario]] puede ser redirigido a la página de solicitud de recuperación.
*   **Validación de Nueva Contraseña Fallida:** Si la nueva contraseña no cumple los requisitos de seguridad (**CA10**), el sistema muestra mensajes de error indicando qué reglas no se cumplen. Se registra un evento de auditoría de fallo (**CA13**). El [[Usuario]] permanece en la interfaz para reintentar.
*   **Error Interno del Sistema (Establecer Nueva Contraseña):** En caso de un error técnico al intentar actualizar la contraseña (**CA11**), el sistema debe registrar el error, mostrar un mensaje de error genérico, y registrar un evento de auditoría de fallo con detalles técnicos (**CA13**). La contraseña no se actualiza.

**Postcondiciones (Solicitud Exitosa):**

*   Se genera un token de recuperación seguro.
*   Se genera una notificación interna para el [[Usuario]] con el enlace de recuperación.
*   Se registra un evento de auditoría.

**Postcondiciones (Restablecimiento Exitoso):**

*   La contraseña del [[Usuario]] se actualiza.
*   El token de recuperación se invalida.
*   Se genera una notificación interna para el [[Usuario]].
*   Se registra un evento de auditoría.
