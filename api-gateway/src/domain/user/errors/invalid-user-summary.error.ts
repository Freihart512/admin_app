export class InvalidUserSummaryError extends Error {
    constructor(public readonly reasons: string[]) {
      super(`Invalid User Summary: ${reasons.join(', ')}`);
      this.name = 'InvalidUserSummaryError';
    }
  }