# Editar Información de Usuario

**Como** [[Administrador]]  
**Quiero** modificar los datos de un [[Usuario]] existente  
**Para** mantener actualizada la información

## Criterios de aceptación
- **CA1**  
  Dado que busco un [[Usuario]] existente  
  Cuando ingreso a su ficha y modifico datos válidos  
  Entonces el sistema guarda los cambios y confirma la actualización

- **CA2**  
  Dado que los datos editados no cumplen reglas de negocio  
  Cuando intento guardar  
  Entonces el sistema rechaza la acción e indica los errores
