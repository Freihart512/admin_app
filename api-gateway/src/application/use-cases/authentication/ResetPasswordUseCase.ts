import {
  ResetPasswordInput,
  MutationResponse,
} from '../../../interfaces/graphql/schemas/authentication';

export class ResetPasswordUseCase {
  constructor() {} // private userRepository: IUserRepository // Aquí se inyectarían dependencias, como repositorios

  async execute(input: ResetPasswordInput): Promise<MutationResponse> {
    // Lógica para restablecer contraseña con token
    // 1. Validar input
    // 2. Validar token (existencia, validez, expiración) y obtener usuario asociado
    // 3. Validar que newPassword y confirmNewPassword coincidan
    // 4. Validar requisitos de seguridad de la nueva contraseña
    // 5. Actualizar contraseña del usuario
    // 6. Invalidar/eliminar token
    if (input.newPassword !== input.confirmNewPassword) {
      return { success: false, message: "New passwords don't match." };
    }

    const tokenIsValid = true;

    if (tokenIsValid) {
      return {
        success: true,
        message: 'Password has been reset successfully.',
      };
    } else {
      return {
        success: false,
        message: 'Invalid or expired token.',
      };
    }
  }
}
