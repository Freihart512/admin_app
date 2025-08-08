export class InvalidPhoneNumberError extends Error {
    constructor(public readonly value: string) {
        super(`Invalid phone number format: "${value}"`);
        this.name = 'InvalidPhoneNumberError';
    }
}
