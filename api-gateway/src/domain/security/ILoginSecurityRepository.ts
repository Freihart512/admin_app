// src/domain/security/ILoginSecurityRepository.ts
export interface LoginSecurity {
  userId: string;
  failedAttempts: number;
  lockedUntil: Date | null;
  lastFailedAt: Date | null;
  lastSuccessAt: Date | null;
  updatedAt: Date; // touch en cada cambio
  createdAt: Date;
}

export interface ILoginSecurityRepository {
  /**
   * Obtiene el registro de seguridad del usuario.
   * Debe retornar null si aún no existe fila para ese userId.
   */
  getByUserId(userId: string): Promise<LoginSecurity | null>;

  /**
   * Asegura que exista el registro para el usuario.
   * Si no existe, lo crea con valores por defecto.
   * Retorna la fila resultante (nueva o existente).
   */
  upsertInitial(userId: string): Promise<LoginSecurity>;

  /**
   * Incrementa failedAttempts y, si llega al umbral, fija lockedUntil.
   * Devuelve la fila actualizada.
   */
  incrementFailedAttemptAndMaybeLock(
    userId: string,
    maxFailedAttempts: number,
    lockoutMinutes: number
  ): Promise<LoginSecurity>;

  /**
   * Resetea failedAttempts y lockedUntil al iniciar sesión exitosamente.
   * Actualiza lastSuccessAt.
   */
  resetOnSuccess(userId: string, at: Date): Promise<LoginSecurity>;

  /**
   * Indica si el usuario está bloqueado actualmente (lockedUntil > now).
   * Debe considerar upsert si no existe, o retornar false si no hay fila.
   */
  isLocked(userId: string, now: Date): Promise<boolean>;
}
