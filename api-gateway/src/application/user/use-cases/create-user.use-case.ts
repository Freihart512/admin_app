import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/ports/user.repository.port';
import { CreateUserDto } from '../dtos/user.dto';
import { AccountStatus } from '@domain/user/user.types';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { Password } from '@domain/user/value-objects/password.value-object';
import { AlreadyValueExistError } from '@domain/user/errors/already-value-exist.error';
import { RepositoryError, UniqueViolationError, ServiceUnavailableError } from '@shared/errors';
import { ValueObject } from '@domain/@shared/value-objects/base.value-object';
import { HashingService } from '@domain/@shared/ports/hashing.service.port';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { PhoneNumber } from '@domain/user/value-objects/phone-number.value-object';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { generateRandomPassword } from '@shared/utils/password-generator';

/**
 * CreateUserUseCase with dependencies via constructor.
 * NOTE: RFC/UUID validators are now registered globally in bootstrap (ValueObjectRegistry).
 */
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const emailAddress = EmailAddress.create(createUserDto.email);
    const rawPassword = generateRandomPassword();
    const password = await Password.create(rawPassword, this.hashingService);

    await this.validateUniqueValue<EmailAddress>(
      emailAddress,
      (v) => this.userRepository.isEmailUnique(v),
      'email',
    );

    const newUser = new User({
      id: UUID.create(createUserDto.id),
      email: emailAddress,
      password: password,
      isAdmin: createUserDto.isAdmin ?? false,
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      roles: createUserDto.roles ?? [],
      phoneNumber: createUserDto.phoneNumber
        ? PhoneNumber.create(createUserDto.phoneNumber)
        : undefined,
      address: createUserDto.address,
      status: AccountStatus.ACTIVE,
      rfc: createUserDto.rfc ? RFC.create(createUserDto.rfc) : undefined,
    });

    const rfcVo = newUser.getRfc();
    const phoneNumberVo = newUser.getPhoneNumber();
    const checks: Promise<boolean>[] = [];
    if (rfcVo) {
      checks.push(
        this.validateUniqueValue<RFC>(rfcVo, (v) => this.userRepository.isRfcUnique(v), 'rfc'),
      );
    }
    if (phoneNumberVo) {
      checks.push(
        this.validateUniqueValue<PhoneNumber>(
          phoneNumberVo,
          (v) => this.userRepository.isPhoneNumberUnique(v),
          'phone number',
        ),
      );
    }
    await Promise.all(checks);

    try {
      await this.userRepository.create(newUser);
    } catch (err: unknown) {
      if (err instanceof UniqueViolationError) {
        throw new AlreadyValueExistError(err.value ?? '', err.field);
      }
      if (err instanceof RepositoryError) {
        throw new ServiceUnavailableError('Imposible crear usuario en este momento.');
      }
      throw err;
    }
    return newUser;
  }

  private async validateUniqueValue<VO extends ValueObject<string>>(
    value: VO,
    checkFunction: (value: VO) => Promise<boolean>,
    fieldName: string,
  ): Promise<boolean> {
    try {
      const isUnique = await checkFunction(value);
      if (!isUnique) {
        throw new AlreadyValueExistError(value.getValue(), fieldName);
      }
      return true;
    } catch (error: unknown) {
      if (error instanceof AlreadyValueExistError) throw error;
      if (error instanceof RepositoryError) {
        throw new ServiceUnavailableError('Imposible verificar valores únicos');
      }
      throw error;
    }
  }
}
