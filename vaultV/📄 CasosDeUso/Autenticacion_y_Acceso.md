# Caso de Uso: Autenticación y Acceso

## Actores
- [[Usuario]] (cualquier rol)
- [[Administrador]] (en flujos especiales como bloqueo/desbloqueo)

## Objetivo
Permitir que un [[Usuario]] acceda de forma segura al sistema y gestione su contraseña (inicio de sesión, recuperación y cambio).

## Precondiciones
- El [[Usuario]] existe y su cuenta está **activa**.
- El [[Usuario]] tiene **correo** registrado.
- El [[Administrador]] puede establecer políticas (complejidad, expiración, intentos).

## Disparadores
- El [[Usuario]] intenta iniciar sesión.
- El [[Usuario]] solicita recuperar su contraseña.
- El [[Usuario]] decide cambiar su contraseña estando autenticado.

## Flujo principal (Inicio de sesión)
1) El [[Usuario]] ingresa correo y contraseña.
2) El sistema valida credenciales y estado de la cuenta.
3) Si son válidas, se crea sesión y se redirige al área correspondiente al [[Rol]] principal del usuario.
4) Se registra el acceso (fecha/hora).

## Flujos alternos / Excepciones
- A1) **Credenciales inválidas**: mostrar error genérico y registrar intento fallido.
- A2) **Cuenta inactiva/bloqueada**: impedir acceso y mostrar mensaje con siguiente paso.
- A3) **Exceso de intentos**: bloquear temporalmente la cuenta según política; notificar al correo.

## Recuperación de contraseña (flujo resumido)
1) El [[Usuario]] solicita recuperación indicando su correo.
2) El sistema envía un enlace temporal o código de verificación.
3) El [[Usuario]] establece nueva contraseña válida.
4) El sistema confirma el cambio y sugiere iniciar sesión.

## Cambio de contraseña (autenticado)
1) El [[Usuario]] autenticado ingresa contraseña actual.
2) Define y confirma nueva contraseña cumpliendo políticas.
3) El sistema valida y actualiza; cierra otras sesiones activas (opcional según política).

## Reglas de negocio
- Política de intentos fallidos y bloqueo temporal.
- Política de complejidad de contraseña.
- Enlace/código de recuperación con expiración.
- Registro de eventos de seguridad (login, intentos, cambios).

## Postcondiciones
- Sesión creada (login exitoso) o intentos fallidos contabilizados.
- Contraseña actualizada (en cambio/recuperación).
- Auditoría de eventos actualizada.

## Indicadores (si aplica)
- Tasa de inicio de sesión exitoso.
- Tiempo promedio de recuperación de contraseña.
- Número de cuentas bloqueadas por intentos fallidos.
