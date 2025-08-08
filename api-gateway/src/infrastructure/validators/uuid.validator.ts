// infrastructure/uuid/ValidateUUID.ts
import { UUIDValidator } from '../../domain/@shared/ports/uuid.validator.port';
import { validate as isUUID } from 'uuid';

export class ValidateUUID implements UUIDValidator {
    validate(uuid: string): boolean {
        return isUUID(uuid);
    }
}
