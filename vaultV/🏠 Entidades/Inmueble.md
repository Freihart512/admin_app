# Inmueble

Ubicación física propiedad de un [[Propietario]], que puede ser rentada a un [[Inquilino]] mediante un [[Contrato]].

---

## ✨ Atributos funcionales

- **Dirección**:  
  - Calle  
  - Número exterior  
  - Número interior (opcional)  
  - Colonia  
  - Código postal  
  - Municipio  
  - Estado
- **Alias**: Nombre corto o identificador interno para facilitar la referencia.
- **Características relevantes**: Número de habitaciones, baños, estacionamientos, amenidades, etc.
- **Historial de [[Contrato]]s** asociados.
- **Estado actual**:  
  - `vacío`  
  - `rentado`  
  - `eliminado`

---

## 🔁 Ciclo de vida

1. **Creación**  
   - Un inmueble se crea en estado `vacío`.

2. **Asociación a [[Contrato]] activo**  
   - Cambia a estado `rentado`.

3. **Finalización o cancelación de contrato**  
   - Regresa a estado `vacío` si no hay otro contrato activo.
   - Puede permanecer en `rentado` si inmediatamente se asocia a un nuevo [[Contrato]].

4. **Eliminación funcional**  
   - Solo un [[Administrador]] puede marcar un inmueble como `eliminado`.

---

## 🚫 Reglas y restricciones

- No se puede eliminar un inmueble si tiene [[Contrato]]s con estado `activo`.  
  - En ese caso, el [[Administrador]] debe cancelar los contratos antes de la eliminación.
- Un inmueble eliminado no puede ser reactivado (en la V1.0), pero permanece en el historial.

---

## 🔗 Relaciones funcionales

- **[[Propietario]]**: Dueño del inmueble.
- **[[Contrato]]**: Define la ocupación del inmueble.
- **[[Inquilino]]**: Ocupante actual cuando el inmueble está `rentado`.
- **[[Administrador]]**: Responsable de alta, baja y gestión del inmueble.
