import { Module } from '@nestjs/common';
import { ValueObjectRegistry } from '@infrastructure/value-objects/value-object.registry';
import { RfcValidator } from '@infrastructure/validators/rfc.validator';
import { UuidValidator } from '@infrastructure/validators/uuid.validator';
import { PasswordGeneratorService } from '@shared/services';
@Module({
  providers: [
    RfcValidator,
    UuidValidator,
    ValueObjectRegistry,
    PasswordGeneratorService
  ],
  exports: [],
})
export class UserModule {}
