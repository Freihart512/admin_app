# Asignar Rol a Usuario

**Como** [[Administrador]]  
**Quiero** asignar uno o más [[Rol]]es a un [[Usuario]] existente  
**Para** otorgarle acceso a las funcionalidades correspondientes

## Criterios de aceptación
- **CA1**  
  Dado que busco un [[Usuario]] existente  
  Cuando selecciono roles permitidos y guardo  
  Entonces el sistema actualiza los roles y confirma la asignación

- **CA2**  
  Dado que intento asignar el rol [[Administrador]] junto con otros  
  Cuando guardo  
  Entonces el sistema rechaza la acción y explica la exclusividad
