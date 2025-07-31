import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import * as bcrypt from 'bcrypt';

export class BCryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10; // Nivel de complejidad recomendado para bcrypt

  /**
   * Genera un hash para una contraseña dada.
   * @param password La contraseña en texto plano.
   * @returns El hash de la contraseña.
   */
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con un hash dado.
   * @param password La contraseña en texto plano.
   * @param hash El hash con el que comparar.
   * @returns True si la contraseña coincide con el hash, False de lo contrario.
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
