import { Injectable, Inject } from '@nestjs/common';
import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/ports/user.repository.port';
import { CreateUserDto } from '../dtos/user.dto';
import { AccountStatuses } from '@domain/user/user.types';
import { EmailAddress } from '@domain/user/value-objects/email-address.value-object';
import { Password } from '@domain/user/value-objects/password.value-object';
import { AlreadyValueExistError } from '@domain/user/errors';
import { ValueObject } from '@domain/@shared/value-objects/base.value-object';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { PhoneNumber } from '@domain/user/value-objects/phone-number.value-object';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { PasswordGeneratorPort } from '@domain/@shared/ports/password-generator.port';
import { AppError } from '@shared/errors';
import { AppErrorCodes } from '@shared/core/types';
import { ErrorMapperPort } from '@domain/@shared/ports';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('PasswordGeneratorPort')
    private readonly passwordGeneratorService: PasswordGeneratorPort,

    @Inject('ErrorMapperPort') private readonly error: ErrorMapperPort,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const emailAddress = EmailAddress.create(createUserDto.email);
    const rawPassword = this.passwordGeneratorService.getRandomPassword();
    const password = await Password.create(rawPassword);

    await this.ensureUnique<EmailAddress>(
      emailAddress,
      () =>
        this.error.wrap(
          this.userRepository.isEmailUnique(emailAddress),
          'users.isEmailUnique',
        ),
      'email',
    );

    const newUser = new User({
      id: UUID.create(createUserDto.id),
      email: emailAddress,
      password,
      isAdmin: createUserDto.isAdmin ?? false,
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      roles: createUserDto.roles ?? [],
      phoneNumber: createUserDto.phoneNumber
        ? PhoneNumber.create(createUserDto.phoneNumber)
        : undefined,
      address: createUserDto.address,
      status: AccountStatuses.ACTIVE,
      rfc: createUserDto.rfc ? RFC.create(createUserDto.rfc) : undefined,
    });

    // Unicidad condicional de RFC y teléfono, en paralelo
    const checks: Promise<unknown>[] = [];
    const rfcVo = newUser.getRfc();
    const phoneVo = newUser.getPhoneNumber();

    if (rfcVo) {
      checks.push(
        this.ensureUnique<RFC>(
          rfcVo,
          () =>
            this.error.wrap(
              this.userRepository.isRfcUnique(rfcVo),
              'users.isRfcUnique',
            ),
          'rfc',
        ),
      );
    }
    if (phoneVo) {
      checks.push(
        this.ensureUnique<PhoneNumber>(
          phoneVo,
          () =>
            this.error.wrap(
              this.userRepository.isPhoneNumberUnique(phoneVo),
              'users.isPhoneNumberUnique',
            ),
          'phone number',
        ),
      );
    }
    await Promise.all(checks);

    // Persistencia
    try {
      await this.error.wrap(
        this.userRepository.create(newUser),
        'users.create',
      );
    } catch (e) {
      // Opcional: si quieres seguir lanzando errores de dominio, traduce AppError aquí.
      if (e instanceof AppError) {
        if (e.code === AppErrorCodes.ALREADY_EXISTS) {
          // perdemos field/value específicos al mapear, así que devolvemos un mensaje genérico
          throw new AlreadyValueExistError('value', 'unique');
        }
      }
      throw e; // re-lanza AppError (lo manejará el resolver)
    }

    return newUser;
  }

  private async ensureUnique<VO extends ValueObject<string>>(
    value: VO,
    repoCheck: () => Promise<boolean>, // ya envuelto con mapper
    fieldName: string,
  ): Promise<void> {
    const isUnique = await repoCheck();
    if (!isUnique) {
      throw new AlreadyValueExistError(value.getValue(), fieldName);
    }
  }
}
