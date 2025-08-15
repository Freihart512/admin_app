export class RoleUserCannotBeAdminError extends Error {
  constructor(
    message = 'User with a business role cannot be an administrator',
  ) {
    super(message);
    this.name = 'RoleUserCannotBeAdminError';
  }
}
