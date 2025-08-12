import { UserRepository } from '../../../domain/user/ports/user.repository.port';
import { UpdateUserDto } from '../dtos/user.dto'; // Assuming this path is correct
import { User } from '../../../domain/user/entity/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common'; // Using NestJS exceptions for example
import { AuditFields } from '../../../@shared/core/types';
import { UserSummary } from '../../../domain/user/value-objects/user-summary.value-object';
import { EmailAddress } from '../../../domain/user/value-objects/email-address.value-object'; // Import EmailAddress
import { RFC } from '../../../domain/@shared/value-objects/rfc.value-object'; // Import RFC
import { PhoneNumber } from '../../../domain/user/value-objects/phone-number.value-object'; // Import PhoneNumber

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(id: string, updateUserDto: UpdateUserDto, currentUser: UserSummary): Promise<User> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // Apply updates from DTO to existing user entity
    if (updateUserDto.name !== undefined) {
      existingUser.name = updateUserDto.name;
    }
    if (updateUserDto.lastName !== undefined) {
      existingUser.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.phoneNumber !== undefined) {
      if (updateUserDto.phoneNumber !== null) {
 const newPhoneNumber = new PhoneNumber(updateUserDto.phoneNumber);
 // Validate uniqueness of phone number if it's being changed and is not null
 if (!existingUser.phoneNumber || newPhoneNumber.getValue() !== existingUser.phoneNumber.getValue()) { // Compare string values
        const userWithSamePhone = await this.userRepository.findByPhoneNumber(newPhoneNumber);
        if (userWithSamePhone && userWithSamePhone.id !== id) {
          throw new ConflictException(`Phone number ${updateUserDto.phoneNumber} is already in use.`);
        }
      }
      existingUser.phoneNumber = newPhoneNumber;
      } else {
 existingUser.phoneNumber = undefined; // Set to undefined for optional fields being removed
    }
    }
    if (updateUserDto.rfc !== undefined) {
      // Validate uniqueness of RFC if it's being changed and is not null
 if (updateUserDto.rfc !== null) {
        const newRfc = new RFC(updateUserDto.rfc);
 if (!existingUser.rfc || newRfc.getValue() !== existingUser.rfc.getValue()) { // Compare string values
          const userWithSameRfc = await this.userRepository.findByRfc(newRfc);
          if (userWithSameRfc && userWithSameRfc.id !== id) {
            throw new ConflictException(`RFC ${updateUserDto.rfc} is already in use.`);
          }
        }
 existingUser.rfc = newRfc;
 } else {
 existingUser.rfc = null;
      }
    }
    // Note: isAdmin, roles, and status changes might require separate use cases
    // or more complex logic depending on requirements and permissions.
    // This UC focuses on basic profile info updates.

    // Apply business rules based on roles after updating fields
    existingUser.validateRequiredFields(); // Assuming User entity has this method

    // Update audit fields
    existingUser.audit.updatedBy = currentUser;
    existingUser.audit.updatedAt = new Date();

    await this.userRepository.save(existingUser);

    return existingUser;
  }
}