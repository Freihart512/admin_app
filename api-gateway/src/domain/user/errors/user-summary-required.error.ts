export class UserSummaryRequiredError extends Error {
  constructor(message = 'User summary is required') {
    super(message);
    this.name = 'UserSummaryRequiredError';
  }
}
