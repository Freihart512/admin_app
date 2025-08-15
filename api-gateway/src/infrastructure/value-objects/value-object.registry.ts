import { Injectable, OnModuleInit } from '@nestjs/common';
import { RFC, UUID, Password } from '@domain/@shared/value-objects';
import { RfcValidator, UuidValidator } from '@infrastructure/validators';
import { BcryptHashingService } from '@infrastructure/services/bcrypt-hashing.service';

/**
 * Infrastructure-side composition root for registering VO validators once.
 */
@Injectable()
export class ValueObjectRegistry implements OnModuleInit {
  constructor(
    private readonly rfcValidator: RfcValidator,
    private readonly uuidValidator: UuidValidator,
    private readonly bcryptHasher: BcryptHashingService,
  ) {}

  onModuleInit() {
    RFC.registerValidator(this.rfcValidator);
    UUID.registerValidator(this.uuidValidator);
    Password.registerHasher(this.bcryptHasher);
  }
}
