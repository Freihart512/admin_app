# US37

## Ver detalles de contrato (Inquilino)

**Caso de Uso:** [[📄 CasosDeUso/CU05_gestionar_contratos.md]]

Como inquilino, quiero obtener los detalles completos de mi contrato de renta activo o histórico a través de una API, para revisar toda la información del acuerdo. (Nota: Asume que un inquilino puede ver detalles de cualquiera de sus contratos, no solo el activo).

### Actor

Inquilino (interactuando a través de una API o servicio del backend)

### Objetivo

Permitir al inquilino autenticado recuperar mediante una solicitud al backend toda la información detallada de un contrato de renta específico donde él figura como inquilino, validando su pertenencia al contrato, y recibir los datos estructurados para su posterior visualización en una interfaz de usuario.

### Criterios de Aceptación (Enfoque Backend)

- CA01: El backend debe exponer un endpoint o servicio accesible para usuarios autenticados que permita a un [[👥 Usuarios/inquilino|inquilino]] solicitar los detalles completos de un [[🏠 Entidades/contrato|contrato]] específico, recibiendo el identificador único del contrato como parámetro en la solicitud.
- CA02: Al recibir una solicitud de detalles de contrato por ID, el backend debe validar la identidad y el rol del usuario autenticado, confirmando que es efectivamente un [[👥 Usuarios/inquilino|inquilino]].
- CA03: El backend debe realizar una validación estricta: verificar que el [[🏠 Entidades/contrato|contrato]] solicitado (mediante su ID) exista en la base de datos **Y** que el campo de inquilino asociado en ese contrato coincida con el identificador del [[👥 Usuarios/inquilino|inquilino]] que ha iniciado sesión. Si el contrato existe pero no está asociado al inquilino solicitante, se debe denegar el acceso.
- CA04: Si el contrato existe y el inquilino asociado es el inquilino solicitante (validación CA03 exitosa), el backend debe construir y retornar una respuesta exitosa (ej. HTTP 200 OK) que contenga todos los datos completos del [[🏠 Entidades/contrato|contrato]]. Los datos retornados deben incluir, pero no limitarse a:
    - Identificador único del contrato.
    - Referencia a la [[🏠 Entidades/propiedad|Propiedad]] asociada (ej. su ID, Dirección completa, y otros datos básicos relevantes para el inquilino). La información de la propiedad debe ser suficiente para que el inquilino sepa a qué inmueble se refiere el contrato.
    - Referencia al [[👥 Usuarios/propietario|Propietario]] asociado (ej. su ID y quizás el nombre del propietario si es relevante y permitido para el inquilino ver esta información). El inquilino necesita saber quién es el propietario de la propiedad que renta/rentó.
    - Fecha de Inicio del contrato.
    - Fecha de Fin del contrato.
    - Monto Mensual de Renta y detalles de pago si son parte del contrato.
    - Estado actual del contrato ('activo', 'pendiente', 'finalizado', 'cancelado', etc.).
    - Cualquier otro campo relevante almacenado en la entidad [[🏠 Entidades/contrato|Contrato]], como indicadores de renovación o la fecha de cancelación (`cancelled_at`) si aplica.
- CA05: La respuesta del backend para la vista de detalles del inquilino debe ser de solo lectura. **No** debe incluir información, URLs, o indicadores que permitan realizar acciones de gestión sobre el contrato (como edición o cancelación), ya que estas acciones están restringidas al rol de Admin.
- CA06: Si el contrato solicitado no se encuentra (no existe con el ID proporcionado), si el contrato existe pero el inquilino asociado no es el inquilino solicitante (falla la validación CA03), o si el usuario autenticado no es un inquilino válido (falla la validación CA02), el backend debe retornar una respuesta de error apropiada para indicar el problema (ej. HTTP 404 Not Found si el contrato no existe o no le pertenece al usuario, HTTP 403 Forbidden si el usuario no es un inquilino válido). El mensaje de error debe ser informativo sin revelar información sobre contratos a los que el usuario no tiene acceso.