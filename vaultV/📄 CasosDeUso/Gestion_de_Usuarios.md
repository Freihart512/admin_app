# Caso de Uso: Gestión de Usuarios

## Actor principal
- [[Administrador]]

## Actores secundarios
- [[Usuario]] (el usuario gestionado)

## Objetivo
Permitir al [[Administrador]] administrar las cuentas de [[Usuario]] en la plataforma: creación, edición, eliminación, y asignación o remoción de [[Rol]]es.

## Precondiciones
- El [[Administrador]] está autenticado y tiene permisos activos.
- El [[Usuario]] a gestionar existe (para edición, roles o eliminación).

## Disparadores
- Alta de nuevo [[Usuario]].
- Necesidad de editar datos existentes.
- Gestión de roles.
- Desactivación/eliminación de cuentas.

## Flujo principal
1) El [[Administrador]] accede a la sección de gestión de [[Usuario]]s.
2) Selecciona la acción: crear, editar, asignar roles, remover roles o eliminar usuario.
3) Completa la información requerida y confirma.
4) El sistema aplica cambios y confirma la operación.

## Flujos alternos / Excepciones
- A1) Usuario no encontrado.
- A2) Datos incompletos o inválidos.
- A3) Intento de eliminar un [[Usuario]] con relaciones activas que impiden la acción (según entidad y rol).

## Reglas de negocio
- Un [[Administrador]] no puede asignar múltiples roles incluyendo [[Administrador]].
- La eliminación de un usuario sigue reglas de eliminación en cascada según su rol.
- Los datos obligatorios dependen del [[Rol]].

## Postcondiciones
- El [[Usuario]] queda registrado o actualizado según la acción.
- Los cambios quedan auditados en el sistema.

## Historias de usuario asociadas
1. [[Agregar_Nuevo_Usuario]]
2. [[Editar_Informacion_Usuario]]
3. [[Eliminar_Usuario]]
4. [[Asignar_Rol_Usuario]]
5. [[Remover_Rol_Usuario]]
