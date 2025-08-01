# Inicio de Sesion

**Como:** [[Usuario]]
**Quiero:** Acceder a la plataforma utilizando mis credenciales
**Para que:** Pueda utilizar las funcionalidades disponibles según mis [[Rol]]es.

**Caso de Uso Padre:** [[Autenticacion_y_Acceso]]

**Criterios de Aceptación:**

*   **CA1:** El [[Usuario]] debe poder acceder a una página de inicio de sesión en la plataforma.
*   **CA2:** La página de inicio de sesión debe solicitar al [[Usuario]] su correo electrónico y contraseña.
*   **CA3:** El sistema debe validar que el correo electrónico y la contraseña proporcionados coincidan con un registro de [[Usuario]] existente y activo en la base de datos.
*   **CA4:** Si las credenciales son válidas y el [[Usuario]] está activo, el sistema debe autenticar al [[Usuario]] y redirigirlo a la página principal de la aplicación o a una página de bienvenida.
*   **CA5:** Si las credenciales son inválidas (correo electrónico no encontrado, contraseña incorrecta) o si el [[Usuario]] está inactivo, el sistema debe mostrar un mensaje de error genérico en la página de inicio de sesión (ej. "Correo electrónico o contraseña incorrectos" o "Usuario inactivo") sin revelar si el correo electrónico existe o la razón exacta del fallo por seguridad.
*   **CA6:** El sistema debe registrar un evento en un historial de auditoría indicando que se intentó iniciar sesión, el correo electrónico proporcionado, la fecha/hora y el resultado de la operación (éxito o fallo), incluyendo el motivo del fallo si aplica.
*   **CA7:** La página de inicio de sesión debe incluir un enlace visible para la funcionalidad de "Recuperación de Contraseña".

**Flujo Principal:**

1.  El [[Usuario]] accede a la URL de la plataforma.
2.  El sistema presenta la página de inicio de sesión (**CA1**, **CA2**).
3.  El [[Usuario]] ingresa su correo electrónico y contraseña.
4.  El [[Usuario]] envía el formulario de inicio de sesión.
5.  El sistema recibe las credenciales y valida que correspondan a un [[Usuario]] activo (**CA3**).
6.  Si las credenciales son válidas y el [[Usuario]] está activo, el sistema autentica al [[Usuario]] y lo redirige (**CA4**).
7.  El sistema registra un evento de auditoría de éxito (**CA6**).

**Flujos Alternativos/Excepciones:**

*   **Credenciales Inválidas o Usuario Inactivo:** Si las credenciales no coinciden con un [[Usuario]] activo (**CA3**), el sistema muestra un mensaje de error genérico en la página de inicio de sesión (**CA5**). Se registra un evento de auditoría de fallo con el motivo (**CA6**). El [[Usuario]] permanece en la página de inicio de sesión.
*   **Error Interno del Sistema:** En caso de un error técnico durante el proceso de autenticación, el sistema debe registrar el error, mostrar un mensaje de error genérico al [[Usuario]], y registrar un evento de auditoría de fallo con detalles técnicos (**CA6**).

**Postcondiciones (Éxito):**

*   El [[Usuario]] está autenticado en la plataforma.
*   El [[Usuario]] es redirigido a la página principal o de bienvenida.
*   Se registra un evento de auditoría de éxito.
