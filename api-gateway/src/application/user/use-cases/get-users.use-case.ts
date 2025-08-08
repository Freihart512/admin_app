import { UserRepository } from "../../../domain/user/ports/user.repository.port";
import { User } from "../../../domain/user/entity/user.entity";
import { BusinessRole } from "../../../@shared/core/types";

interface GetUsersParams {
  status?: 'active' | 'inactive';
  role?: BusinessRole;
  isAdmin?: boolean;
  limit?: number;
  offset?: number;
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: GetUsersParams): Promise<{ users: User[], totalCount: number, hasNextPage: boolean }> {
    const { status, role, isAdmin, limit, offset } = params;

    // Use listUsers for pagination and filtering
    const result = await this.userRepository.listUsers({ status, role, isAdmin, limit, offset });
    return result;
  }
}