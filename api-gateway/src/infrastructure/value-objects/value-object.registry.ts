import { Injectable, OnModuleInit } from '@nestjs/common';
import { RFC } from '@domain/@shared/value-objects/rfc.value-object';
import { UUID } from '@domain/@shared/value-objects/uuid.value-object';
import { RfcValidator } from '@infrastructure/validators/rfc.validator';
import { UuidValidator } from '@infrastructure/validators/uuid.validator';

/**
 * Infrastructure-side composition root for registering VO validators once.
 */
@Injectable()
export class ValueObjectRegistry implements OnModuleInit {
  constructor(
    private readonly rfcValidator: RfcValidator,
    private readonly uuidValidator: UuidValidator,
  ) {}

  onModuleInit() {
    RFC.registerValidator(this.rfcValidator);
    UUID.registerValidator(this.uuidValidator);
  }
}
