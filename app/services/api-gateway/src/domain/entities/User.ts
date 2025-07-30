// Define la entidad User en el dominio
export class User {
  constructor(
    public id: string, // Identificador Único (aunque sea interno, es necesario en el dominio)
    public email: string,
    public name: string,
    public lastName: string,
    public phoneNumber?: string, // Opcional
    public address?: string, // Opcional
    public rfc?: string, // Opcional
    public roles: string[], // Lista de roles (ej. ['Propietario', 'Inquilino'])
    public passwordHash: string, // El hash de la contraseña (nunca la contraseña en texto plano)
    public isActive: boolean // Estado de la cuenta
  ) {}

  // Métodos o lógica de negocio relacionados con la entidad User pueden ir aquí

  // Método para validar si un hash de contraseña proporcionado coincide con el hash almacenado
  // La implementación concreta de la comparación de hashes se delega a un servicio de infraestructura/dominio secundario.
  public async passwordMatches(providedPasswordHash: string): Promise<boolean> {
    // Aquí se llamaría a la lógica de comparación de hashes
    // Por ejemplo, podrías inyectar una dependencia IPasswordHasher si usas un servicio de dominio secundario
    // return await passwordHasher.compare(providedPasswordHash, this.passwordHash);
    console.log(`Comparing provided hash with stored hash for user ${this.email}`);
    // Simulación de comparación de hashes
    return providedPasswordHash === this.passwordHash; // <<<< NO USAR ESTO EN PRODUCCIÓN con hashes reales
  }

  // Método para cambiar la contraseña. Recibe el hash de la nueva contraseña (generado en la aplicación/infraestructura).
  public updatePassword(newHashedPassword: string): void {
      this.passwordHash = newHashedPassword;
  }

   // Método para actualizar el estado (en el caso de gestión de usuarios)
   public updateStatus(isActive: boolean): void {
       this.isActive = isActive;
   }

   // Método para actualizar roles (en el caso de gestión de usuarios y roles)
   public updateRoles(roles: string[]): void {
       this.roles = roles;
   }

  // Puedes añadir getters/setters si prefieres un control más granular sobre el acceso a las propiedades
}