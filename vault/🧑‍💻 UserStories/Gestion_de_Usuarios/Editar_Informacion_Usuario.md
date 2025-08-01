# Editar Información de Usuario

**Como:** [[Administrador]]
**Quiero:** Modificar la información de un [[Usuario]] existente en la plataforma
**Para que:** Pueda corregir datos erróneos o actualizar perfiles.

**Caso de Uso Padre:** [[Gestión_de_Usuarios]]

**Criterios de Aceptación:**

*   **CA1:** El [[Administrador]] debe poder buscar y seleccionar un [[Usuario]] existente en la plataforma.
*   **CA2:** El [[Administrador]] debe poder acceder a una interfaz de edición con la información actual del [[Usuario]] precargada.
*   **CA3:** El [[Administrador]] debe poder modificar los siguientes campos del [[Usuario]]: Nombre, Apellido, Correo electrónico, Número de teléfono, Dirección y RFC.
*   **CA4:** Se debe validar que la información modificada cumpla con los criterios de validación de formato (ej. formato de RFC válido, formato de correo electrónico válido). Adicionalmente, se debe validar la obligatoriedad de los campos Número de teléfono, Dirección y RFC **basándose en los [[Rol]]es que el [[Usuario]] tiene asignados en el momento de la edición**. Si el [[Usuario]] tiene el rol [[Propietario]] o [[Inquilino]], estos campos son obligatorios al guardar la edición si el usuario tiene esos roles.
*   **CA5:** Si se modifica el Correo electrónico, se debe validar que el nuevo correo sea único en el sistema (no debe existir otro [[Usuario]] con ese correo).
*   **CA6:** Al guardar los cambios, la información del [[Usuario]] debe ser actualizada en el sistema si las validaciones son exitosas.
*   **CA7:** El sistema debe generar una **notificación interna** visible para todos los [[Administrador]]es informando que se editó la información de un [[Usuario]] específico, detallando si se modificaron el Correo electrónico o el RFC. **Nota V1.0: El envío de correos electrónicos está fuera del alcance inicial. La notificación será visible dentro de la interfaz administrativa.**
*   **CA8:** Si se modifica el RFC del [[Usuario]], el sistema debe generar una **notificación interna** específica para ese [[Usuario]] informándole que su RFC ha sido actualizado en la plataforma. **Nota V1.0: La notificación será visible dentro de la interfaz del usuario.**
*   **CA9:** El sistema debe notificar al [[Administrador]] que realizó la acción sobre el éxito o el fracaso de la operación de edición del usuario, indicando los motivos en caso de fallo (ej. validación fallida, correo duplicado).
*   **CA10:** El sistema debe registrar un evento en un historial de auditoría indicando que se intentó editar la información de un [[Usuario]], quién realizó el cambio, la fecha/hora, y el resultado de la operación (éxito o fallo), incluyendo los campos que fueron modificados y detalles del fallo si aplica.

**Flujo Principal:**

1.  El [[Administrador]] navega a la sección de administración de usuarios.
2.  El [[Administrador]] busca o selecciona el [[Usuario]] cuya información desea editar (**CA1**).
3.  El sistema presenta la interfaz de edición con la información actual del [[Usuario]] (**CA2**).
4.  El [[Administrador]] modifica los campos necesarios (Nombre, Apellido, Correo electrónico, Número de teléfono, Dirección, RFC) (**CA3**).
5.  El [[Administrador]] guarda los cambios.
6.  El sistema valida la información modificada según los criterios de aceptación, incluyendo la obligatoriedad basada en los roles actuales del usuario y la unicidad del correo electrónico si se modificó (**CA4**, **CA5**).
7.  Si la validación es exitosa, el sistema actualiza el registro del [[Usuario]] (**CA6**).
8.  El sistema genera la notificación interna para todos los [[Administrador]]es si se modificó el Correo electrónico o el RFC (**CA7**).
9.  Si se modificó el RFC, el sistema genera la notificación interna para el [[Usuario]] editado (**CA8**).
10. El sistema registra un evento de auditoría de éxito para la operación, detallando los campos modificados (**CA10**).
11. El sistema notifica al [[Administrador]] que el [[Usuario]] fue editado exitosamente (**CA9**).

**Flujos Alternativos/Excepciones:**

*   **Usuario No Encontrado:** Si el [[Usuario]] que se intenta seleccionar no existe (**CA1**), el sistema muestra un mensaje de error y se registra un evento de auditoría de fallo (**CA10**).
*   **Información Modificada Inválida o Incompleta (Validación de Formato u Obligatoriedad por Rol):** Si la validación de la información modificada falla (ej. formato inválido, campos que son obligatorios para los roles actuales del usuario están vacíos - **CA4**), el sistema muestra mensajes de error y no guarda los cambios. Se registra un evento de auditoría de fallo (**CA10**). El [[Administrador]] puede corregir la información y reintentar.
*   **Correo Electrónico Duplicado (si se modificó):** Si el nuevo correo electrónico proporcionado ya existe en el sistema (**CA5**), el sistema muestra un mensaje de error indicando que no se puede usar ese correo. Se registra un evento de auditoría de fallo (**CA10**).
*   **Fallo al Actualizar el Usuario en el Sistema:** En caso de un error interno del sistema durante el proceso de actualización del [[Usuario]] (**CA6**), el sistema debe registrar el error, notificar al [[Administrador]] (**CA9**), y registrar un evento de auditoría de fallo (**CA10**). Los cambios no deben guardarse.
*   **Fallo al Generar Notificaciones Internas (CA7, CA8):** Si ocurre un error técnico al intentar generar las notificaciones internas, el sistema debe registrar el incidente, notificar al [[Administrador]] sobre el error específico (**CA9**), y registrar un evento de auditoría de fallo para las notificaciones (**CA10**). La operación principal de edición del [[Usuario]] **sí** se completa si fue exitosa.
