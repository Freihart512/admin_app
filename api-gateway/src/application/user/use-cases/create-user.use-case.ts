// import { User } from '../../../domain/user/entity/user.entity';
// import { UserRepository } from '../../../domain/user/ports/user.repository.port';
// import { CreateUserDto } from '../dtos/user.dto';
// import { AccountStatus } from '@domain/user/user.types';
// import { EmailAddress } from '../../../domain/user/value-objects/email-address.value-object';
// import { Password } from '../../../domain/user/value-objects/password.value-object';
// import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
// import { ServiceUnavailableError } from '@shared/errors/service-unavailable.error';
// import { generateRandomPassword } from '@shared/utils/password-generator'
// import { ValueObject } from '@domain/@shared/value-objects/base.value-object';
// import { HashingService } from '@domain/@shared/ports/hashing.service.port';
// import { RFCValidator } from '@domain/@shared/ports/rfc.validator.port';
// import { UUIDValidator } from '@domain/@shared/ports/uuid.validator.port';
// import { DataAccessError } from '@infrastructure/database/errors/data-access.error';
// import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
// import { PhoneNumber } from '@domain/user/value-objects';
// import { RFC } from '@domain/@shared/value-objects/rfc.value-object';


// export class CreateUserUseCase {
//   constructor(private readonly userRepository: UserRepository) { }
//   async execute(createUserDto: CreateUserDto, hashingService: HashingService, validateRfc: RFCValidator, validateUUID: UUIDValidator): Promise<User> {
//     const emailAddress = EmailAddress.create(createUserDto.email);
//     const password = await Password.create(generateRandomPassword(), hashingService);

//     this.validateUniqueValue<EmailAddress>(emailAddress, this.userRepository.isEmailUnique, 'Email')

//     const newUser = new User({
//       id: UUID.create(createUserDto.id, validateUUID), // Assuming createUserDto.id is the raw string
//       email: emailAddress,
//       password: password,
//       isAdmin: createUserDto.isAdmin,
//       name: createUserDto.name,
//       lastName: createUserDto.lastName,
//       roles: createUserDto.roles,
//       phoneNumber: createUserDto.phoneNumber ? PhoneNumber.create(createUserDto.phoneNumber) : undefined,
//       address: createUserDto.address,
//       status: AccountStatus.ACTIVE,
//       rfc: createUserDto.rfc ? RFC.create(createUserDto.rfc, validateRfc) : undefined,
//     });

//     const promises: Promise<boolean>[] = [];
//     const rfc = newUser.getRfc();
//     const phoneNumber = newUser.getPhoneNumber();


//     if (rfc) {
//       promises.push(this.validateUniqueValue<RFC>(rfc, this.userRepository.isRfcUnique, 'RFC'));
//     }

//     if (phoneNumber) {
//       promises.push(this.validateUniqueValue<PhoneNumber>(phoneNumber, this.userRepository.isPhoneNumberUnique, 'Phone Number'));
//     }

//     await Promise.all(promises);

//     await this.userRepository.create(newUser);
//     return newUser
//   }

//   private async validateUniqueValue<voType>(
//     value: voType,
//     checkFunction: (value: voType) => Promise<boolean>,
//     fieldName: string
//   ): Promise<boolean> {
//     try {
//       const isUnique = await checkFunction(value);
//       if (!isUnique) {
//         throw new AlreadyValueExistError((value as ValueObject<string, undefined>).getValue(), fieldName);
//       }
//       return true;
//     } catch (error) {
//       if (error instanceof AlreadyValueExistError) {
//         throw error
//       }
//       console.error(error)
//       if (error instanceof DataAccessError) {
//         throw new ServiceUnavailableError('Imposible check unique values')
//       }
//       throw error
//     }

//   }
// }

import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/ports/user.repository.port';
import { CreateUserDto } from '../dtos/user.dto';
import { AccountStatus } from '@domain/user/user.types';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { Password } from '@domain/user/value-objects/password.value-object';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { ServiceUnavailableError } from '@shared/errors/service-unavailable.error';
import { ValueObject } from '@domain/@shared/value-objects/base.value-object';
import { HashingService } from '@domain/@shared/ports/hashing.service.port';
import { RFCValidator } from '@domain/@shared/ports/rfc.validator.port';
import { UUIDValidator } from '@domain/@shared/ports/uuid.validator.port';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { PhoneNumber } from '@domain/user/value-objects';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { PasswordGenerator } from '@domain/@shared/ports/password-generator.port'; // nuevo puerto
import { RepositoryUnavailableError } from '@domain/@shared/errors/repository-unavailable.error'; // error de capa dominio/app

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly rfcValidator: RFCValidator,
    private readonly uuidValidator: UUIDValidator,
    private readonly passwordGenerator: PasswordGenerator, // en lugar de util suelto
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const email = EmailAddress.create(dto.email);
    const rawPassword = this.passwordGenerator.generate(); // política de password por puerto
    const password = await Password.create(rawPassword, this.hashingService);

    const user = new User({
      id: UUID.create(dto.id, this.uuidValidator),
      email,
      password,
      isAdmin: dto.isAdmin,
      name: dto.name,
      lastName: dto.lastName,
      roles: dto.roles,
      phoneNumber: dto.phoneNumber ? PhoneNumber.create(dto.phoneNumber) : undefined,
      address: dto.address,
      status: AccountStatus.ACTIVE,
      rfc: dto.rfc ? RFC.create(dto.rfc, this.rfcValidator) : undefined,
    });

    // Pre-checks best-effort (opcional). O confía solo en constraints.
    await Promise.all([
      this.validateUniqueValue(email, (v) => this.userRepository.isEmailUnique(v), 'email'),
      user.getRfc()
        ? this.validateUniqueValue(user.getRfc()!, (v) => this.userRepository.isRfcUnique(v), 'rfc')
        : Promise.resolve(true),
      user.getPhoneNumber()
        ? this.validateUniqueValue(user.getPhoneNumber()!, (v) => this.userRepository.isPhoneNumberUnique(v), 'phoneNumber')
        : Promise.resolve(true),
    ]);

    try {
      await this.userRepository.create(user);
    } catch (err) {
      // El adapter del repo debe mapear 23505 → AlreadyValueExistError(field, value)
      if (err instanceof AlreadyValueExistError) throw err;
      if (err instanceof RepositoryUnavailableError) {
        throw new ServiceUnavailableError('No fue posible crear el usuario en este momento.');
      }
      throw err;
    }

    return user;
  }

  private async validateUniqueValue<VO extends ValueObject<string, any>>(
    value: VO,
    check: (value: VO) => Promise<boolean>,
    fieldName: string
  ): Promise<true> {
    try {
      const isUnique = await check(value);
      if (!isUnique) {
        throw new AlreadyValueExistError(value.getValue(), fieldName);
      }
      return true as const;
    } catch (error) {
      if (error instanceof AlreadyValueExistError) throw error;
      // No dependas de infraestructura aquí
      throw new ServiceUnavailableError(`No se pudo verificar unicidad para ${fieldName}.`);
    }
  }
}
