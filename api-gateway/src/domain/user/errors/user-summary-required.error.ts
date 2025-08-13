export class UserSummaryRequiredError extends Error {
  constructor() {
    super('UserSummary is required');
    this.name = 'UserSummaryRequiredError';
  }
}