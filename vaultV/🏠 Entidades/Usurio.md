# Usuario

Representa a una persona que interactúa con el sistema, con credenciales de acceso y uno o más [[Rol]]es asignados. Puede ser un [[Administrador]], [[Propietario]], [[Inquilino]] o [[Contador]]. Sirve como base para la autenticación y autorización dentro de la plataforma.

---

## ✨ Atributos funcionales

- **Correo electrónico**: Identificador único para inicio de sesión y notificaciones.
- **Nombre** y **Apellido**
- **Número de teléfono**  
  - Obligatorio para [[Propietario]] e [[Inquilino]]  
  - Opcional para [[Administrador]] y [[Contador]]
- **Dirección**  
  - Obligatoria para [[Propietario]] e [[Inquilino]]  
  - Opcional para [[Administrador]] y [[Contador]]
- **RFC** (Registro Federal de Contribuyentes)  
  - Obligatorio para [[Propietario]] e [[Inquilino]]  
  - Único dentro del sistema para quienes lo tengan definido
- **[[Rol]]es asignados**  
  - Un usuario puede tener múltiples roles  
  - El rol de [[Administrador]] es exclusivo (no combinable con otros)  
  - Al menos un rol debe estar asignado
- **Contraseña**: Se requiere para acceder al sistema.
- **Estado de la cuenta**: Activa o inactiva.

---

## 🔁 Ciclo de vida

- Un usuario es creado por un [[Administrador]] o por auto-registro.
- Puede iniciar sesión, recuperar contraseña, y modificar sus datos según permisos.
- Los [[Administrador]]es pueden gestionar perfiles, cambiar roles y activar/desactivar cuentas.

---

## 🗑️ Comportamiento al eliminar un Usuario

La eliminación se realiza como una desactivación funcional. Se requiere mantener la integridad de los datos relacionados según el rol asignado:

- **[[Propietario]]**  
  - Se elimina el registro del propietario  
  - Se cancelan [[Contrato]]s activos y se eliminan [[Inmueble]]s relacionados
- **[[Inquilino]]**  
  - Se elimina su registro  
  - Se cancelan sus [[Contrato]]s activos
- **[[Contador]]**  
  - Se elimina su registro  
  - Se eliminan asociaciones con [[Propietario]]s
- **[[Administrador]]**  
  - Solo se marca como inactivo  
  - Su historial debe permanecer para trazabilidad

> ⚠️ No se debe permitir la desactivación si alguna acción asociada no puede completarse exitosamente.

---

## ✅ Validaciones funcionales

- Correo debe ser válido y único
- Nombre y Apellido obligatorios
- Teléfono obligatorio para [[Propietario]] e [[Inquilino]]
- Dirección obligatoria para [[Propietario]] e [[Inquilino]]
- RFC obligatorio y único cuando aplica
- Al menos un [[Rol]] asignado
- [[Administrador]] no puede coexistir con otros roles

---

## 🔗 Relaciones funcionales según rol

- **[[Administrador]]**  
  - Gestiona entidades del sistema  
  - Visualiza alertas y monitoreo general

- **[[Propietario]]**  
  - Asociado a [[Inmueble]]s y [[Contrato]]s  
  - Tiene un [[Contador]] asignado (opcional)  
  - Recibe notificaciones sobre facturas y pagos

- **[[Inquilino]]**  
  - Asociado a [[Contrato]]s como arrendatario  
  - Recibe notificaciones y accede a sus [[Factura]]s y [[Pago]]s

- **[[Contador]]**  
  - Asociado a uno o más [[Propietario]]s  
  - Visualiza y gestiona [[Factura]]s para fines fiscales

---
