import { User } from '../entities/User'; // Asumiendo que tendrás una entidad User en el dominio

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>; // Para crear un nuevo usuario (en el caso de gestión de usuarios)
  update(user: User): Promise<void>; // Para actualizar datos básicos (en el caso de gestión de usuarios)
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  // Métodos para tokens de recuperación de contraseña
  savePasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  findPasswordResetToken(token: string): Promise<{ userId: string, expiresAt: Date } | null>;
  invalidatePasswordResetToken(token: string): Promise<void>;
  // Métodos relacionados con el estado del usuario (activo/inactivo)
  updateStatus(userId: string, isActive: boolean): Promise<void>; // En el caso de gestión de usuarios
  // Métodos relacionados con roles (en el caso de gestión de usuarios y roles)
  updateRoles(userId: string, roles: string[]): Promise<void>; // En el caso de gestión de usuarios y roles
}

// Podrías tener interfaces para otros repositorios si son necesarios para autenticación,
// aunque el de usuario es el principal para estas funcionalidades.
// export interface IPasswordResetTokenRepository { ... }