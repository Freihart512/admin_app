import { UserRepository } from '../../../domain/user/ports/user.repository.port';
import { User } from '../../../domain/user/entity/user.entity';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}