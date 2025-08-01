# Asignar Rol a Usuario

**Como:** [[Administrador]]
**Quiero:** Asignar uno o varios [[Rol]]es a un [[Usuario]] existente
**Para que:** El [[Usuario]] tenga los permisos y acceso adecuados a las funcionalidades de la plataforma.

**Caso de Uso Padre:** [[Gestión_de_Usuarios]]

**Criterios de Aceptación:**

*   **CA1:** El [[Administrador]] debe poder buscar y seleccionar un [[Usuario]] existente al que desea asignar roles.
*   **CA2:** El sistema debe mostrar los roles que el [[Usuario]] tiene actualmente asignados.
*   **CA3:** El [[Administrador]] debe poder seleccionar uno o varios [[Rol]]es de una lista de roles disponibles ([[Administrador]], [[Propietario]], [[Inquilino]], [[Contador]]) para asignárselos al [[Usuario]].
*   **CA4:** Se debe validar que la combinación de roles seleccionada sea válida. Específicamente, el rol [[Administrador]] **no puede ser seleccionado** si el [[Usuario]] ya tiene asignado otro rol (Propietario, Inquilino, Contador) o si se intenta asignar junto con otro rol en la misma operación.
*   **CA5:** Al intentar asignar los roles [[Propietario]] o [[Inquilino]], el sistema debe validar que el [[Usuario]] tenga completa la información obligatoria asociada a esos roles (Número de teléfono, Dirección y RFC). Si falta información o es inválida, la asignación de esos roles debe fallar con un mensaje claro indicando qué información falta o es incorrecta.
*   **CA6:** Al confirmar la asignación, el sistema debe actualizar los roles asignados al [[Usuario]]. Si se asigna un nuevo rol (ej. Propietario, Inquilino, Contador), el sistema debe crear el registro correspondiente en la entidad específica del rol si aún no existe.
*   **CA7:** Si la asignación de roles es exitosa (y se asignó al menos un nuevo rol de Propietario, Inquilino o Contador), el sistema debe generar una **notificación interna** para el [[Administrador]] (o quizás otros administradores) informando que se asignó un nuevo rol a un [[Usuario]]. La notificación debe especificar qué roles fueron asignados.
*   **CA8:** Si se asigna el rol [[Propietario]] al [[Usuario]], el sistema debe generar una **notificación interna** específica para ese [[Usuario]] informándole que ahora tiene el rol de Propietario y cuáles son las capacidades asociadas (esto podría ser una notificación más detallada o bienvenida). **Nota V1.0: La notificación será visible dentro de la interfaz del usuario.**
*   **CA9:** El sistema debe notificar al [[Administrador]] que realizó la acción sobre el éxito o el fracaso de la operación de asignación de roles, indicando los motivos en caso de fallo (ej. combinación de roles inválida, información obligatoria faltante).
*   **CA10:** El sistema debe registrar un evento en un historial de auditoría indicando que se intentó asignar roles a un [[Usuario]], quién realizó la acción, la fecha/hora, los roles que se intentaron asignar, y el resultado de la operación (éxito o fallo), incluyendo detalles del fallo si aplica.

**Flujo Principal:**

1.  El [[Administrador]] navega a la sección de administración de usuarios.
2.  El [[Administrador]] busca o selecciona el [[Usuario]] cuyos roles desea gestionar (**CA1**).
3.  El sistema muestra la información del [[Usuario]], incluyendo sus roles actuales (**CA2**).
4.  El [[Administrador]] selecciona la opción para asignar roles.
5.  El sistema presenta una interfaz para seleccionar los roles disponibles.
6.  El [[Administrador]] selecciona los roles que desea asignar (**CA3**).
7.  El [[Administrador]] confirma la asignación.
8.  El sistema valida la combinación de roles seleccionada (**CA4**).
9.  Si la validación de combinación de roles es exitosa, el sistema valida si la información obligatoria del usuario está completa y es válida para los roles de [[Propietario]] o [[Inquilino]] si se intentan asignar (**CA5**).
10. Si todas las validaciones son exitosas, el sistema actualiza los roles del [[Usuario]] y crea los registros de entidad de rol si es necesario (**CA6**).
11. Si se asignó un nuevo rol (Propietario, Inquilino o Contador), el sistema genera la notificación interna para administradores (**CA7**).
12. Si se asignó el rol [[Propietario]], el sistema genera la notificación interna específica para el usuario (**CA8**).
13. El sistema registra un evento de auditoría de éxito para la operación (**CA10**).
14. El sistema notifica al [[Administrador]] que realizó la acción sobre el éxito de la operación (**CA9**).

**Flujos Alternativos/Excepciones:**

*   **Usuario No Encontrado:** Si el [[Usuario]] que se intenta seleccionar no existe (**CA1**), el sistema muestra un mensaje de error y se registra un evento de auditoría de fallo (**CA10**).
*   **Combinación Inválida de Roles:** Si el [[Administrador]] intenta asignar una combinación inválida de roles (**CA4**), el sistema muestra un mensaje de error indicando la restricción. Se registra un evento de auditoría de fallo (**CA10**). La asignación de roles no se completa.
*   **Información Obligatoria Faltante o Inválida para Roles (CA5):** Si se intentan asignar los roles [[Propietario]] o [[Inquilino]] pero la información obligatoria del [[Usuario]] (Número de teléfono, Dirección, RFC) está incompleta o es inválida, el sistema muestra un mensaje de error indicando qué información falta o es incorrecta. Se registra un evento de auditoría de fallo (**CA10**). La asignación de roles no se completa.
*   **Fallo al Actualizar Roles o Crear Entidad de Rol (CA6):** En caso de un error interno del sistema al intentar actualizar los roles del [[Usuario]] o crear la entidad de rol correspondiente, el sistema debe registrar el error, notificar al [[Administrador]] (**CA9**), y registrar un evento de auditoría de fallo (**CA10**). Los roles no deben ser modificados y los registros de entidad de rol no deben crearse/modificarse.
*   **Fallo al Generar Notificaciones Internas (CA7, CA8):** Si ocurre un error técnico al intentar generar las notificaciones internas, el sistema debe registrar el incidente, notificar al [[Administrador]] sobre el error específico (**CA9**), y registrar un evento de auditoría de fallo para las notificaciones (**CA10**). La operación principal de asignación de roles **sí** se completa si fue exitosa.
