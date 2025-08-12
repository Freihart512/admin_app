export class AdminCannotHaveBusinessRolesError extends Error {
    constructor(message = 'Admin users cannot have business roles') {
      super(message);
      this.name = 'AdminCannotHaveBusinessRolesError';
    }
  }