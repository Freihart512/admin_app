# Recuperacion de Contrasena

**Como** [[Usuario]]  
**Quiero** recuperar el acceso cuando olvidé mi contraseña  
**Para** poder iniciar sesión nuevamente

## Criterios de aceptación
- **CA1**
  - Dado que accedo a la sección “¿Olvidaste tu contraseña?”
  - Cuando ingreso mi correo registrado
  - Entonces el sistema envía un enlace/código temporal al correo

- **CA2**
  - Dado que recibí un enlace/código de recuperación válido y vigente
  - Cuando ingreso una nueva contraseña que cumple políticas
  - Entonces el sistema actualiza mi contraseña y confirma el cambio

- **CA3**
  - Dado que el enlace/código expiró o es inválido
  - Cuando intento usarlo
  - Entonces el sistema rechaza la acción e invita a solicitar uno nuevo
