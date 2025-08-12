import { Module } from '@nestjs/common';
import { ValueObjectRegistry } from '@infrastructure/value-objects/value-object.registry';
import { RfcValidator } from '@infrastructure/validators/rfc.validator';
import { UuidValidator } from '@infrastructure/validators/uuid.validator';
@Module({
  providers: [
    RfcValidator,
    UuidValidator,
    ValueObjectRegistry,
  ],
  exports: [],
})
export class UserModule {}
