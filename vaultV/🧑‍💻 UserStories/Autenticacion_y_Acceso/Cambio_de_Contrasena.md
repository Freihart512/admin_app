# Cambio de Contrasena

**Como** [[Usuario]] autenticado  
**Quiero** cambiar mi contraseña actual  
**Para** mantener la seguridad de mi cuenta

## Criterios de aceptación
- **CA1**
  - Dado que estoy autenticado
  - Cuando ingreso mi contraseña actual y una nueva que cumple políticas
  - Entonces el sistema actualiza mi contraseña y confirma el cambio

- **CA2**
  - Dado que mi contraseña actual no coincide
  - Cuando intento guardarla
  - Entonces el sistema rechaza el cambio y muestra un error

- **CA3**
  - Dado que el sistema aplica políticas de seguridad
  - Cuando cambio mi contraseña
  - Entonces se cierran otras sesiones activas (si la política lo establece) y se registra el evento
