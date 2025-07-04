# US36

## Listar contratos (Inquilino)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como inquilino, quiero obtener un listado de todos mis contratos de renta (activos e históricos) a través de una API, para tener una visión general de mis acuerdos pasados y presentes.

### Actor

Inquilino (interactuando a través de una API o servicio del backend)

### Objetivo

Permitir al inquilino autenticado recuperar mediante una solicitud al backend un listado de todos los contratos de renta donde él figura como inquilino, incluyendo contratos con diferentes estados (activo, finalizado, cancelado), y recibir los datos clave de cada contrato para su visualización en una interfaz de usuario.

### Criterios de Aceptación (Enfoque Backend)

- CA01: El backend debe exponer un endpoint o servicio accesible para usuarios autenticados que permita a un [[👥 Usuarios/inquilino|inquilino]] solicitar un listado de sus [[🏠 Entidades/contrato|contratos]]. La solicitud no debe requerir un identificador de inquilino explícito, ya que el backend debe utilizar la identidad del usuario autenticado para filtrar los contratos.
- CA02: Al recibir una solicitud para el listado de contratos de inquilino, el backend debe validar la identidad y el rol del usuario autenticado, asegurando que sea efectivamente un [[👥 Usuarios/inquilino|inquilino]].
- CA03: Si el usuario es un [[👥 Usuarios/inquilino|inquilino]] válido (validación CA02 exitosa), el backend debe realizar una consulta para identificar **todos** los [[🏠 Entidades/contrato|contratos]] en la base de datos donde el campo de inquilino asociado coincide con el identificador del usuario autenticado. Esto debe incluir contratos con estado 'activo', 'finalizado' y 'cancelado'.
- CA04: Para cada contrato en el listado, el backend debe retornar un conjunto de datos que incluya información clave relevante para el [[👥 Usuarios/inquilino|inquilino]], incluyendo al menos:
    - Identificador único del contrato.
    - Referencia a la [[🏠 Entidades/propiedad|Propiedad]] asociada (ej. su ID y/o Dirección, si es relevante y permitido por otros CUs que el Inquilino vea información básica de la Propiedad).
    - Fecha de Inicio del contrato.
    - Fecha de Fin del contrato.
    - Monto Mensual de Renta.
    - Estado actual del contrato.
- CA05: El backend puede soportar parámetros opcionales en la solicitud para filtrado (ej. por estado del contrato, por propiedad) u ordenación (ej. por fecha de inicio o fin), si estas funcionalidades son requeridas por la UI. En ausencia de filtros/ordenación, el listado se retorna con un orden predeterminado (ej. por fecha de inicio descendente).
- CA06: El backend debe ser capaz de manejar de forma eficiente el retorno de un número considerable de contratos por inquilino si fuera el caso, posiblemente implementando paginación si la lista puede ser muy extensa. La respuesta debe indicar el número total de contratos si se usa paginación.
- CA07: Cada elemento en la lista retornada debe incluir el identificador único del contrato, permitiendo que la interfaz de usuario pueda realizar una solicitud posterior a la US37 para obtener los detalles completos de un contrato específico seleccionado del listado.
- CA08: Si el usuario autenticado no corresponde al rol de [[👥 Usuarios/inquilino|inquilino]], el backend debe retornar una respuesta de error apropiada que indique falta de permisos (ej. HTTP 403 Forbidden).
- CA09: Si el [[👥 Usuarios/inquilino|inquilino]] autenticado no tiene ningún contrato asociado en el sistema (ni activo, ni finalizado, ni cancelado), el backend debe retornar una respuesta exitosa (ej. HTTP 200 OK) con un listado de contratos vacío.