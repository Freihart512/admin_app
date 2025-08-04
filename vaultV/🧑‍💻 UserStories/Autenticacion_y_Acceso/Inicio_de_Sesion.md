# Inicio de Sesion

**Como** [[Usuario]]  
**Quiero** iniciar sesión con mi correo y contraseña  
**Para** acceder a mis funcionalidades según mi [[Rol]]

## Criterios de aceptación
- **CA1**
  - Dado que soy un [[Usuario]] activo
  - Cuando ingreso mi correo y contraseña válidos
  - Entonces accedo al sistema y veo mi panel según mi [[Rol]]

- **CA2**
  - Dado que ingreso credenciales inválidas
  - Cuando intento iniciar sesión
  - Entonces veo un mensaje de error genérico y se registra el intento

- **CA3**
  - Dado que supero el número de intentos fallidos permitidos
  - Cuando intento iniciar sesión nuevamente
  - Entonces mi cuenta queda bloqueada temporalmente y recibo una notificación al correo

- **CA4**
  - Dado que mi cuenta está inactiva o bloqueada
  - Cuando intento iniciar sesión
  - Entonces no puedo acceder y veo instrucciones para resolverlo
