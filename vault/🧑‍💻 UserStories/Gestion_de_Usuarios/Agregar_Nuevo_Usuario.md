# Agregar Nuevo Usuario

**Como:** [[Administrador]]
**Quiero:** Agregar un nuevo [[Usuario]] básico a la plataforma
**Para que:** Posteriormente se le puedan asignar [[Rol]]es y pueda acceder al sistema con sus credenciales iniciales.

**Caso de Uso Padre:** [[Gestión_de_Usuarios]]

**Criterios de Aceptación:**

*   **CA1:** El [[Administrador]] debe poder acceder a una interfaz en la plataforma para iniciar el proceso de adición de un nuevo [[Usuario]].
*   **CA2:** La interfaz debe solicitar la información esencial para el nuevo [[Usuario]]: Nombre, Apellido, Correo electrónico, Número de teléfono, Dirección y RFC.
*   **CA3:** Se debe validar que el Correo electrónico tenga un formato válido y sea único en el sistema (no debe existir otro [[Usuario]] con el mismo correo).
*   **CA4:** Se debe validar que Nombre y Apellido sean campos obligatorios.
*   **CA5:** Se debe validar que Número de teléfono, Dirección y RFC sean opcionales durante la creación básica del usuario. La obligatoriedad de estos campos dependerá de los [[Rol]]es asignados posteriormente.
*   **CA6:** Se debe validar que el RFC, si se proporciona, tenga un formato válido y sea único globalmente entre todos los [[Usuario]]s con RFC definido.
*   **CA7:** Al confirmar la creación, el sistema debe crear un nuevo registro de [[Usuario]] con la información proporcionada y un estado inicial (ej. 'pendiente de asignación de rol' o similar).
*   **CA8:** El sistema debe asignar automáticamente una contraseña inicial (temporal o generada aleatoriamente) al nuevo [[Usuario]].
*   **CA9:** El sistema debe generar una **notificación interna** en la plataforma informando al [[Administrador]] (o quizás a otros administradores) sobre la creación de la cuenta básica, proporcionando las credenciales iniciales (correo electrónico y contraseña temporal) e instrucciones generales para el primer inicio de sesión. **Nota V1.0: El envío de correos electrónicos está fuera del alcance inicial. La notificación será visible dentro de la interfaz administrativa.**
*   **CA10:** El sistema debe notificar al [[Administrador]] sobre el éxito o el fracaso de la operación de creación del usuario, indicando los motivos en caso de fallo.
*   **CA11:** El sistema debe registrar un evento en un historial de auditoría indicando que se intentó agregar un nuevo [[Usuario]], quién realizó la acción, la fecha/hora, y el resultado de la operación (éxito o fallo), incluyendo detalles del fallo si aplica.

**Flujo Principal:**

1.  El [[Administrador]] navega a la sección de administración de usuarios.
2.  El [[Administrador]] selecciona la opción para agregar un nuevo [[Usuario]].
3.  El sistema presenta un formulario con los campos requeridos para la información básica del [[Usuario]].
4.  El [[Administrador]] completa la información requerida (los campos opcionales pueden dejarse vacíos).
5.  El [[Administrador]] confirma la creación.
6.  El sistema valida la información proporcionada según los criterios de aceptación (**CA3**, **CA4**, **CA6**).
7.  Si la validación es exitosa, el sistema crea el nuevo registro de [[Usuario]] con un estado inicial y genera una contraseña inicial (**CA7**, **CA8**).
8.  El sistema genera la notificación interna sobre la creación de la cuenta básica y las credenciales iniciales (**CA9**).
9.  El sistema registra un evento de auditoría de éxito para la operación (**CA11**).
10. El sistema notifica al [[Administrador]] que el [[Usuario]] básico fue creado exitosamente (**CA10**).

**Flujos Alternativos/Excepciones:**

*   **Información Inválida o Incompleta (Campos Obligatorios):** Si la validación de los campos obligatorios falla (ej. formato de correo inválido, campos Nombre o Apellido vacíos - **CA3**, **CA4**), el sistema muestra mensajes de error descriptivos y no crea el [[Usuario]]. Se registra un evento de auditoría de fallo (**CA11**). El [[Administrador]] puede corregir la información y reintentar.
*   **Información Inválida (Campos Opcionales con Formato Incorrecto o RFC Duplicado):** Si se proporciona información en campos opcionales (Número de teléfono, Dirección, RFC) pero con formato incorrecto o si el RFC está duplicado (**CA3**, **CA6**), el sistema muestra mensajes de error descriptivos y no crea el [[Usuario]]. Se registra un evento de auditoría de fallo (**CA11**). El [[Administrador]] puede corregir la información y reintentar.
*   **Correo Electrónico Duplicado:** Si el correo electrónico proporcionado ya existe en el sistema (**CA3**), el sistema muestra un mensaje de error indicando que el [[Usuario]] no puede ser creado con ese correo. Se registra un evento de auditoría de fallo (**CA11**).
*   **Fallo al Generar Contraseña Temporal (CA8) o Notificación Interna (CA9):** Si ocurre un error técnico al intentar generar la contraseña temporal o la notificación interna, el sistema debe registrar el incidente, notificar al [[Administrador]] sobre el error específico (**CA10**), y registrar un evento de auditoría de fallo (**CA11**). La creación del [[Usuario]] **sí** se completa si fue exitosa (**CA7**). Se debe proporcionar al [[Administrador]] una forma de ver las credenciales iniciales de los usuarios creados.
*   **Fallo en la Creación del Usuario en el Sistema:** En caso de un error interno del sistema durante el proceso de creación del [[Usuario]] (**CA7**), el sistema debe registrar el error, notificar al [[Administrador]] (**CA9**), y registrar un evento de auditoría de fallo (**CA11**). La operación completa debe ser revertida para evitar datos inconsistentes.
