# Agregar Nuevo Usuario

**Como** [[Administrador]]  
**Quiero** agregar un nuevo [[Usuario]]  
**Para** poder asignarle [[Rol]]es y permitirle acceso al sistema

## Criterios de aceptación
- **CA1**  
  Dado que soy [[Administrador]]  
  Cuando accedo a “Agregar Usuario” y completo los campos obligatorios  
  Entonces el sistema crea el usuario con estado `activo` y sin roles asignados por defecto

- **CA2**  
  Dado que el correo ya existe en el sistema  
  Cuando intento registrar un nuevo usuario  
  Entonces recibo un mensaje de error indicando duplicidad
