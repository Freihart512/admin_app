export class AddressRequiredForOwnerError extends Error {
  constructor(message = 'Address is required for Owner role') {
    super(message);
    this.name = 'AddressRequiredForOwnerError';
  }
}