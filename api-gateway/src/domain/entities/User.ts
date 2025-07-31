export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public lastName: string,
    public phoneNumber?: string,
    public address?: string,
    public rfc?: string,
    public roles: string[],
    public passwordHash: string,
    public isActive: boolean
  ) {}

  public async passwordMatches(providedPasswordHash: string): Promise<boolean> {
    return providedPasswordHash === this.passwordHash; // <<<< NO USAR ESTO EN PRODUCCIÓN con hashes reales
  }

  public updatePassword(newHashedPassword: string): void {
    this.passwordHash = newHashedPassword;
  }

  public updateStatus(isActive: boolean): void {
    this.isActive = isActive;
  }

  public updateRoles(roles: string[]): void {
    this.roles = roles;
  }
}
