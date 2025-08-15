export class NonAdminMustHaveRolesError extends Error {
  constructor(message = 'Non-admin users must have at least one role') {
    super(message);
    this.name = 'NonAdminMustHaveRolesError';
  }
}
