# Eliminar Usuario

**Como** [[Administrador]]  
**Quiero** desactivar o eliminar un [[Usuario]]  
**Para** controlar el acceso y depurar cuentas innecesarias

## Criterios de aceptación
- **CA1**  
  Dado que busco un [[Usuario]]  
  Cuando selecciono eliminar y confirmo  
  Entonces el sistema valida reglas de negocio (ej. contratos activos) y, si es posible, marca el usuario como `inactivo` o lo elimina

- **CA2**  
  Dado que el [[Usuario]] tiene relaciones activas que impiden su eliminación  
  Cuando intento eliminarlo  
  Entonces el sistema bloquea la acción y muestra los motivos
