# Remover Rol de Usuario

**Como** [[Administrador]]  
**Quiero** remover uno o más [[Rol]]es a un [[Usuario]] existente  
**Para** ajustar sus permisos

## Criterios de aceptación
- **CA1**  
  Dado que busco un [[Usuario]] con roles asignados  
  Cuando quito uno o varios roles y guardo  
  Entonces el sistema actualiza los roles y confirma el cambio

- **CA2**  
  Dado que intento dejar al usuario sin ningún rol  
  Cuando guardo  
  Entonces el sistema rechaza la acción indicando que al menos un rol es obligatorio
