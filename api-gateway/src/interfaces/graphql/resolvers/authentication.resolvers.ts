// Importa todos los tipos necesarios desde el archivo generado por codegen
import {
  LoginInput,
  LoginPayload,
  MutationResponse,
  RequestPasswordResetInput, // Añadir este tipo
  ResetPasswordInput, // Añadir este tipo
  ChangePasswordInput, // Añadir este tipo
} from '../generated/graphql';
// Importamos las instancias de los casos de uso resueltas desde el archivo de composición
import { loginUseCase } from '../../../composition';
// Importa otros casos de uso desde la composición a medida que sus resolvers los necesiten
// import { requestPasswordResetUseCase, resetPasswordUseCase, changePasswordUseCase } from '../../../composition';
import { InvalidCredentialsError } from '../../../domain/errors/authentication/InvalidCredentialsError';

const authenticationResolvers = {
  Mutation: {
    login: async (_: any, { input }: { input: LoginInput }): Promise<LoginPayload> => {
      try {
        // Llamamos al caso de uso LoginUseCase para manejar la lógica de negocio
        const result = await loginUseCase.execute(input);
        // El caso de uso devuelve el LoginPayload directamente en caso de éxito
        return result;
      } catch (error: any) {
        console.error('Error in login resolver:', error);
        // Manejar errores lanzados por el caso de uso
        if (error instanceof InvalidCredentialsError) {
          // Si es un error de credenciales inválidas (incluyendo usuario no encontrado/inactivo o contraseña incorrecta)
          // Lanzamos un error GraphQL con el mensaje genérico requerido por la US (CA5)
          throw new Error('Invalid credentials or user is inactive.');
          // Opcional: Podrías añadir extensiones al error GraphQL para un manejo más avanzado en el cliente
          // throw new GraphQLError('Invalid credentials or user is inactive.', {
          //   extensions: {
          //     code: 'INVALID_CREDENTIALS', // Código de error personalizado
          //     // Puedes añadir otros datos no sensibles aquí
          //   },
          // });
        }
        // Para cualquier otro tipo de error (ej. error inesperado de base de datos, error de la aplicación no manejado),
        // lanzamos un error genérico o un error más específico si tenemos otros tipos de errores de dominio/aplicación.
        // Por ahora, un error genérico es suficiente para otros fallos inesperados.
        throw new Error(`An unexpected error occurred during login.`);
        // O podrías usar un error de Apollo Server como InternalServerError si es un fallo del servidor
        // throw new GraphQLError('An unexpected error occurred.', {
        //    extensions: { code: 'INTERNAL_SERVER_ERROR' },
        // });
      }
    },

    requestPasswordReset: async (
      _: any,
      { input }: { input: RequestPasswordResetInput }
    ): Promise<MutationResponse> => {
      try {
        // Llamar al caso de uso RequestPasswordResetUseCase
        // const result = await requestPasswordResetUseCase.execute(input);
        // Devolver datos de prueba o el resultado real del caso de uso

        return {
          success: true,
          message: 'If your email exists, you will receive instructions to reset your password.',
        };
      } catch (error: any) {
        console.error('Error in requestPasswordReset resolver:', error);
        // Mapeo de errores del caso de uso a respuestas GraphQL
        return { success: false, message: error.message || 'An unexpected error occurred.' };
      }
    },

    resetPassword: async (
      _: any,
      { input }: { input: ResetPasswordInput }
    ): Promise<MutationResponse> => {
      try {
        // Llamar al caso de uso ResetPasswordUseCase
        // const result = await resetPasswordUseCase.execute(input);
        // Devolver datos de prueba o el resultado real del caso de uso

        if (input.newPassword !== input.confirmNewPassword) {
          return { success: false, message: "New passwords don't match." };
        }
        return {
          success: true,
          message: 'Your password has been reset successfully.',
        };
      } catch (error: any) {
        console.error('Error in resetPassword resolver:', error);
        // Mapeo de errores del caso de uso a respuestas GraphQL
        return { success: false, message: error.message || 'An unexpected error occurred.' };
      }
    },

    changePassword: async (
      _: any,
      { input }: { input: ChangePasswordInput }
    ): Promise<MutationResponse> => {
      try {
        // Llamar al caso de uso ChangePasswordUseCase
        // const result = await changePasswordUseCase.execute(input);
        // Devolver datos de prueba o el resultado real del caso de uso

        if (input.newPassword !== input.confirmNewPassword) {
          return { success: false, message: "New passwords don't match." };
        }
        // En un resolver real de cambio de contraseña, necesitarías acceder al usuario autenticado
        // Esto generalmente se hace a través del contexto de GraphQL.

        return {
          success: true,
          message: 'Your password has been changed successfully.',
        };
      } catch (error: any) {
        console.error('Error in changePassword resolver:', error);
        // Mapeo de errores del caso de uso a respuestas GraphQL
        return { success: false, message: error.message || 'An unexpected error occurred.' };
      }
    },
  },
};

export default authenticationResolvers;
