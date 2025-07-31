import {
  RequestPasswordResetInput,
  MutationResponse,
} from '../../../interfaces/graphql/schemas/authentication';

export class RequestPasswordResetUseCase {
  constructor() {} // private notificationService: INotificationService // private userRepository: IUserRepository, // Aquí se inyectarían dependencias, como repositorios o servicios de notificación

  async execute(input: RequestPasswordResetInput): Promise<MutationResponse> {
    const userExistsAndIsActive = true;

    if (userExistsAndIsActive) {
      return {
        success: true,
        message: 'If your email exists, you will receive reset instructions.',
      };
    } else {
      return {
        success: true,
        message: 'If your email exists, you will receive reset instructions.',
      };
    }
  }
}
