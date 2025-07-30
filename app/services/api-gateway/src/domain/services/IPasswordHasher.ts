// Define la interfaz para un servicio de hashing de contraseñas
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}