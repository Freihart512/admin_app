import { User } from '../../../domain/user/entity/user.entity';
import { UserRepository } from '../../../domain/user/ports/user.repository.port';
import { CreateUserDto } from '../dtos/user.dtos';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library for generating IDs
import { AccountStatus, BusinessRole } from '../../../@shared/core/types';
import { UserSummary } from '../../../domain/user/value-objects/user-summary.value-object'; // Import UserSummary

import { EmailAddress } from '../../../domain/user/value-objects/email-address.value-object';
import { RFC } from '../../../domain/@shared/value-objects/rfc.value-object';
import { PhoneNumber } from '../../../domain/user/value-objects/phone-number.value-object';
import { Password } from '../../../domain/user/value-objects/password.value-object'; // Import Password

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(createUserDto: CreateUserDto, currentUser: UserSummary): Promise<User> {
    // Apply business rules and validations
    const emailAddress = EmailAddress.create(createUserDto.email);
    const existingUser = await this.userRepository.findByEmail(emailAddress.getValue());
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Basic validation for admin exclusivity
    if (createUserDto.isAdmin && createUserDto.roles && createUserDto.roles.length > 0) {
      throw new Error('Admin users cannot have business roles');
    }

    // Basic validation for required fields based on roles
    if (createUserDto.roles.includes(BusinessRole.OWNER) || createUserDto.roles.includes(BusinessRole.TENANT)) {
      if (!createUserDto.phoneNumber) {
        throw new Error('Phone number is required for Owner and Tenant roles');
      }
      if (!createUserDto.rfc) {
        throw new Error('RFC is required for Owner and Tenant roles');
      }
    }
    if (createUserDto.roles.includes(BusinessRole.OWNER) && !createUserDto.isAdmin) {
      if (!createUserDto.address) {
        throw new Error('Address is required for Owner role');
      }
    }
    
    const password = await Password.create(createUserDto.password); // Create Password VO and hash    

    const newUser = new User({
      id: uuidv4(), // Generate a unique ID
      email: emailAddress.getValue(), // Pass the string value of EmailAddress
      passwordHash: password.getHashedValue(), // Pass the hashed string value from Password VO
      isAdmin: createUserDto.isAdmin ?? false,
      name: createUserDto.name,
 lastName: createUserDto.lastName,
      roles: createUserDto.roles ?? [],
      phoneNumber: createUserDto.phoneNumber ? new PhoneNumber(createUserDto.phoneNumber) : undefined, // Pass the string value or null
      address: createUserDto.address ?? null,
      status: AccountStatus.ACTIVE, // Assuming new users are active by default
      audit: {
        createdAt: new Date(),
        createdBy: currentUser, // Pass the UserSummary instance
        updatedAt: null, // Initialize audit fields
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
      rfc: createUserDto.rfc ? new RFC(createUserDto.rfc) : undefined, // Pass the string value or null
    );

    await this.userRepository.save(newUser);
    return newUser
  }
}