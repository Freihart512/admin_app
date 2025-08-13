import { InvalidEmailReasonsType } from "../user.types.js";

export class InvalidPhoneNumberError extends Error {
    constructor(public readonly value: string, public readonly reason?: InvalidEmailReasonsType) {
        super(`Invalid phone number (${reason}): "${value}"}`);
        this.name = 'InvalidPhoneNumberError';
    }
}
