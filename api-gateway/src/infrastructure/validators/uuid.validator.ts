import { UuidValidatorPort } from '@domain/@shared/ports/uuid.validator.port';
import { validate as isUUID } from 'uuid';
import { Injectable } from '@nestjs/common';

/**
 * Implementation of the UuidValidatorPort using the uuid package.
 *
 * The @Injectable() decorator allows Nest to treat this class as a provider
 * and manage its lifecycle. Without it, dependency injection would fail
 * when attempting to inject this validator into other services.
 */
@Injectable()
export class UuidValidator implements UuidValidatorPort {
  validate(uuid: string): boolean {
    return isUUID(uuid);
  }
}
