import { UuidValidatorPort } from '@domain/@shared/ports/uuid.validator.port';
import { validate as isUUID } from 'uuid';

export class UuidValidator implements UuidValidatorPort {
    validate(uuid: string): boolean {
        return isUUID(uuid);
    }
}
