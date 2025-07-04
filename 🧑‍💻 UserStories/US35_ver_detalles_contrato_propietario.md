# US35

## Ver detalles de contrato (Propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como propietario, quiero obtener los detalles completos de un contrato de renta asociado a mis propiedades a través de una API, para integrarla en una interfaz que me permita revisar la información específica del acuerdo.

### Actor

Propietario (interactuando a través de una API o servicio del backend)

### Objetivo

Permitir al propietario autenticado recuperar mediante una solicitud al backend toda la información detallada de un contrato de renta específico, validando que dicho contrato corresponda a una de las propiedades de su titularidad, y recibir los datos estructurados para su posterior visualización en una interfaz de usuario.

### Criterios de Aceptación (Enfoque Backend)

- CA01: El backend debe exponer un endpoint o servicio accesible para usuarios autenticados que permita solicitar los detalles de un [[🏠 Entidades/contrato|contrato]] específico, recibiendo como parámetro el identificador único del contrato.
- CA02: Al recibir una solicitud para ver detalles de un contrato, el backend debe validar la identidad y el rol del usuario autenticado, confirmando que es un [[👥 Usuarios/propietario|propietario]].
- CA03: El backend debe realizar una validación de negocio crucial: verificar que el [[🏠 Entidades/contrato|contrato]] solicitado (mediante su ID) exista en la base de datos **Y** que la [[🏠 Entidades/propiedad|propiedad]] a la que está asociado dicho contrato **pertenezca al [[👥 Usuarios/propietario|propietario]] que ha iniciado sesión**. Esta verificación debe ser estricta para asegurar la seguridad y privacidad de los datos.
- CA04: Si el contrato existe, la propiedad asociada pertenece al propietario solicitante (validación CA03 exitosa) y el usuario es un propietario (validación CA02 exitosa), el backend debe construir y retornar una respuesta exitosa (ej. HTTP 200 OK) que contenga todos los datos completos del [[🏠 Entidades/contrato|contrato]]. Los datos retornados deben incluir, pero no limitarse a:
    - Identificador único del contrato.
    - Referencia a la [[🏠 Entidades/propiedad|Propiedad]] asociada (ej. su ID, y quizás datos clave como dirección si son parte de la entidad Contrato o se pueden incluir de forma eficiente).
    - Referencia al [[👥 Usuarios/inquilino|Inquilino]] asociado (ej. su ID, y quizás nombre si son parte de la entidad Contrato o se pueden incluir de forma eficiente).
    - Fecha de Inicio del contrato.
    - Fecha de Fin del contrato.
    - Monto Mensual de Renta.
    - Estado actual del contrato ('activo', 'pendiente', 'finalizado', 'cancelado', etc.).
    - Cualquier otro campo relevante almacenado en la entidad [[🏠 Entidades/contrato|Contrato]], como indicadores de renovación o la fecha de cancelación (`cancelled_at`) si aplica.
- CA05: La respuesta del backend para la vista de detalles del propietario debe ser de solo lectura. **No** debe incluir información, URLs, o indicadores que permitan realizar acciones de gestión sobre el contrato (como edición o cancelación), ya que estas acciones están restringidas al rol de Admin (según US12 y US13).
- CA06: Si el contrato solicitado no se encuentra (no existe con el ID proporcionado), si el contrato existe pero la propiedad asociada no pertenece al propietario solicitante (falla la validación CA03), o si el usuario autenticado no es un propietario válido (falla la validación CA02), el backend debe retornar una respuesta de error apropiada para indicar el problema (ej. HTTP 404 Not Found si el contrato no existe o no se encuentra en su lista, HTTP 403 Forbidden si el usuario no tiene permisos para ese contrato o rol).
- CA07: La información de la [[🏠 Entidades/propiedad|Propiedad]] y el [[👥 Usuarios/inquilino|Inquilino]] incluida en la respuesta del contrato debe ser consistente con los permisos de visualización generales de estos roles. Si hay User Stories separadas que definen qué detalles de Propiedad o Inquilino puede ver un Propietario, esta respuesta no debe exponer más información de la permitida por esas otras USs.