# Remover Rol de Usuario

**Como:** [[Administrador]]
**Quiero:** Remover uno o varios [[Rol]]es asignados a un [[Usuario]] existente
**Para que:** Pueda gestionar los permisos y acceso de los usuarios a las funcionalidades de la plataforma.

**Caso de Uso Padre:** [[Gestión_de_Usuarios]]

**Criterios de Aceptación:**

*   **CA1:** El [[Administrador]] debe poder buscar y seleccionar un [[Usuario]] existente cuyos roles desea modificar.
*   **CA2:** El sistema debe mostrar los roles que el [[Usuario]] tiene actualmente asignados.
*   **CA3:** El [[Administrador]] debe poder seleccionar uno o varios de los roles asignados al [[Usuario]] para removerlos.
*   **CA4:** Se debe validar que el [[Usuario]] no se quede sin ningún rol asignado. Un [[Usuario]] debe tener siempre al menos un rol.
*   **CA5:** Si se remueve el rol [[Propietario]] o [[Inquilino]], el sistema debe verificar si el [[Usuario]] tiene [[Contrato]]s activos asociados a ese rol.
*   **CA6:** Si al remover el rol [[Propietario]] o [[Inquilino]], el [[Usuario]] tiene [[Contrato]]s activos asociados a ese rol, el sistema **no debe permitir la remoción directa del rol**. Se debe notificar al [[Administrador]] que primero debe cancelar los contratos activos asociados a ese rol.
*   **CA7:** Si la remoción de roles es exitosa (y no incumple **CA4** o **CA6**), el sistema debe actualizar los roles asignados al [[Usuario]], eliminando los roles seleccionados.
*   **CA8:** Si se remueve el rol [[Propietario]], el sistema debe marcar como inactivo el registro correspondiente en la entidad [[Propietario]].
*   **CA9:** Si se remueve el rol [[Inquilino]], el sistema debe marcar como inactivo el registro correspondiente en la entidad [[Inquilino]].
*   **CA10:** Si se remueve el rol [[Contador]], el sistema debe marcar como inactivo el registro correspondiente en la entidad [[Contador]]. Adicionalmente, se debe eliminar la asociación con cualquier [[Propietario]] al que estuviera vinculado.
*   **CA11:** Si la remoción de roles es exitosa (y se removió al menos un rol de Propietario, Inquilino o Contador), el sistema debe generar una **notificación interna** para el [[Administrador]] (o quizás otros administradores) informando que se removió un rol a un [[Usuario]]. La notificación debe especificar qué roles fueron removidos.
*   **CA12:** El sistema debe notificar al [[Administrador]] que realizó la acción sobre el éxito o el fracaso de la operación de remoción de roles, indicando los motivos en caso de fallo (ej. intentar remover el último rol, contratos activos asociados).
*   **CA13:** El sistema debe registrar un evento en un historial de auditoría indicando que se intentó remover roles a un [[Usuario]], quién realizó la acción, la fecha/hora, los roles que se intentaron remover, y el resultado de la operación (éxito o fallo), incluyendo detalles del fallo si aplica.

**Flujo Principal:**

1.  El [[Administrador]] navega a la sección de administración de usuarios.
2.  El [[Administrador]] busca o selecciona el [[Usuario]] cuyos roles desea gestionar (**CA1**).
3.  El sistema muestra la información del [[Usuario]], incluyendo sus roles actuales (**CA2**).
4.  El [[Administrador]] selecciona la opción para remover roles.
5.  El sistema presenta una interfaz con la lista de roles asignados actualmente al [[Usuario]] para seleccionar cuáles remover.
6.  El [[Administrador]] selecciona los roles que desea remover (**CA3**).
7.  El [[Administrador]] confirma la remoción.
8.  El sistema valida que el [[Usuario]] no se quede sin roles después de la remoción (**CA4**).
9.  Si la validación de **CA4** es exitosa, el sistema verifica si se están removiendo los roles [[Propietario]] o [[Inquilino]] y si hay contratos activos asociados a esos roles (**CA5**).
10. Si no hay contratos activos asociados (o no se removieron esos roles) y **CA4** fue exitoso, el sistema actualiza los roles del [[Usuario]] removiendo los seleccionados (**CA7**).
11. El sistema marca como inactivo el registro de la entidad de rol correspondiente si se removieron los roles [[Propietario]], [[Inquilino]] o [[Contador]] (**CA8**, **CA9**, **CA10**). Si se removió el rol [[Contador]], también elimina las asociaciones con propietarios (**CA10**).
12. Si la remoción fue exitosa (y se removió un rol de Propietario, Inquilino o Contador), el sistema genera la notificación interna para administradores (**CA11**).
13. El sistema registra un evento de auditoría de éxito para la operación (**CA13**).
14. El sistema notifica al [[Administrador]] que realizó la acción sobre el éxito de la operación (**CA12**).

**Flujos Alternativos/Excepciones:**

*   **Usuario No Encontrado:** Si el [[Usuario]] que se intenta seleccionar no existe (**CA1**), el sistema muestra un mensaje de error y se registra un evento de auditoría de fallo (**CA13**).
*   **Intento de Remover el Último Rol:** Si el [[Administrador]] intenta remover el único rol asignado al [[Usuario]] (**CA4**), el sistema muestra un mensaje de error indicando que el usuario debe tener al menos un rol. Se registra un evento de auditoría de fallo (**CA13**). La remoción no se completa.
*   **Contratos Activos Asociados (CA6):** Si se intenta remover el rol [[Propietario]] o [[Inquilino]] y el [[Usuario]] tiene contratos activos asociados a ese rol (**CA5**), el sistema muestra un mensaje de error indicando que primero se deben cancelar los contratos activos. Se registra un evento de auditoría de fallo (**CA13**). La remoción no se completa.
*   **Fallo al Actualizar Roles o Desactivar Entidad de Rol (CA7, CA8, CA9, CA10):** En caso de un error interno del sistema al intentar actualizar los roles del [[Usuario]], desactivar la entidad de rol correspondiente o eliminar asociaciones, el sistema debe registrar el error, notificar al [[Administrador]] (**CA12**), y registrar un evento de auditoría de fallo (**CA13**). Los roles no deben ser modificados y los registros de entidad de rol no deben afectarse.
*   **Fallo al Generar Notificación Interna (CA11):** Si ocurre un error técnico al intentar generar la notificación interna, el sistema debe registrar el incidente, notificar al [[Administrador]] sobre el error específico (**CA12**), y registrar un evento de auditoría de fallo para la notificación (**CA13**). La operación principal de remoción de roles **sí** se completa si fue exitosa.
