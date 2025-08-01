# Eliminar Usuario

**Como:** [[Administrador]]
**Quiero:** Desactivar o eliminar una cuenta de [[Usuario]] en la plataforma
**Para que:** Pueda gestionar el acceso de los usuarios al sistema y remover cuentas que ya no son necesarias.

**Caso de Uso Padre:** [[Gestión_de_Usuarios]]

**Criterios de Aceptación:**

*   **CA1:** El [[Administrador]] debe poder buscar y seleccionar un [[Usuario]] existente cuya cuenta desea gestionar (desactivar, activar, o marcar para eliminación).
*   **CA2:** El sistema debe mostrar el estado actual de la cuenta del [[Usuario]] (activo o inactivo).
*   **CA3:** El [[Administrador]] debe tener la opción de cambiar el estado de la cuenta del [[Usuario]] entre 'activo' e 'inactivo'.
*   **CA4:** Si el [[Administrador]] cambia el estado de la cuenta a 'inactivo', el sistema debe desencadenar las acciones correspondientes a la desactivación del [[Usuario]] según lo definido en la entidad [[Usuario]]. Esto incluye, si el usuario tiene roles asociados, la desactivación de esos roles y los efectos en cascada a sus entidades de negocio (ej. cancelación de contratos y eliminación de inmuebles para un propietario, cancelación de contratos para un inquilino, eliminación de asociaciones con propietarios para un contador).
*   **CA5:** Si el [[Administrador]] cambia el estado de la cuenta a 'activo', el sistema debe reactivar la cuenta del [[Usuario]] y sus roles asociados que fueron desactivados previamente como parte del proceso de desactivación. Las entidades de negocio (contratos, inmuebles, etc.) que fueron afectadas por la desactivación NO deben ser reactivadas automáticamente; su gestión posterior es manual si es necesario.
*   **CA6:** El sistema no debe permitir la eliminación lógica de un [[Usuario]] si el proceso de desactivación en cascada para sus roles asociados no puede completarse exitosamente o dejaría datos inconsistentes en el sistema. En tales casos, el sistema debe notificar al [[Administrador]] y la operación debe ser revertida.
*   **CA7:** Al confirmar el cambio de estado, el sistema debe actualizar el estado de la cuenta del [[Usuario]] y ejecutar las lógicas en cascada correspondientes (**CA4**, **CA5**).
*   **CA8:** El sistema debe generar una **notificación interna** en la plataforma informando sobre la desactivación/activación de la cuenta del [[Usuario]] y sus posibles efectos.
*   **CA9:** El sistema debe notificar al [[Administrador]] que realizó la acción sobre el éxito o el fracaso de la operación (cambio de estado) y sus efectos en cascada, indicando los motivos en caso de fallo.
*   **CA10:** El sistema debe registrar un evento en un historial de auditoría indicando que se intentó cambiar el estado de una cuenta de [[Usuario]], quién realizó la acción, la fecha/hora, el estado anterior y nuevo, y el resultado de la operación (éxito o fallo), incluyendo detalles del fallo si aplica.

**Flujo Principal:**

1.  El [[Administrador]] navega a la sección de administración de usuarios.
2.  El [[Administrador]] busca o selecciona el [[Usuario]] cuya cuenta desea gestionar (**CA1**).
3.  El sistema muestra la información del [[Usuario]], incluyendo su estado actual (**CA2**).
4.  El [[Administrador]] selecciona la opción para cambiar el estado de la cuenta (activar/desactivar) (**CA3**).
5.  El [[Administrador]] confirma la acción.
6.  El sistema inicia el proceso de cambio de estado y las lógicas en cascada asociadas según el nuevo estado (**CA4**, **CA5**).
7.  El sistema valida que la operación en cascada pueda completarse sin dejar inconsistencias (**CA6**).
8.  Si la validación es exitosa, el sistema actualiza el estado del [[Usuario]] y completa las lógicas en cascada (**CA7**).
9.  El sistema genera la notificación interna sobre la operación (**CA8**).
10. El sistema registra un evento de auditoría de éxito para la operación (**CA10**).
11. El sistema notifica al [[Administrador]] que realizó la acción sobre el éxito de la operación (**CA9**).

**Flujos Alternativos/Excepciones:**

*   **Usuario No Encontrado:** Si el [[Usuario]] que se intenta seleccionar no existe (**CA1**), el sistema muestra un mensaje de error y se registra un evento de auditoría de fallo (**CA10**).
*   **Fallo en la Lógica en Cascada (CA4, CA5):** Si ocurre un error durante la ejecución de las acciones en cascada al cambiar el estado, o si la validación de consistencia falla (**CA6**), el sistema detiene la operación, registra el error, notifica al [[Administrador]] (**CA9**) y registra un evento de auditoría de fallo (**CA10**). La operación completa de cambio de estado debe ser revertida.
*   **Fallo al Actualizar el Estado del Usuario:** En caso de un error interno del sistema al intentar actualizar el estado principal del [[Usuario]] (**CA7**), el sistema debe registrar el error, notificar al [[Administrador]] (**CA9**), y registrar un evento de auditoría de fallo (**CA10**).
*   **Fallo al Generar Notificación Interna:** Si ocurre un error técnico al intentar generar la notificación interna (**CA8**), el sistema debe registrar el incidente, notificar al [[Administrador]] sobre el error específico (**CA9**), y registrar un evento de auditoría de fallo para la notificación (**CA10**). La operación principal de cambio de estado (y su lógica en cascada) **sí** se completa si fue exitosa.
