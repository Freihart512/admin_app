export class FieldRequiredForUserSummaryError extends Error {
  constructor(public readonly field: 'name' | 'lastName') {
    super(`User Summary field ${field} is required`);
    this.name = 'FieldRequiredForUserSummaryError';
  }
}