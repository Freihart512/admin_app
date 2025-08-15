export class FieldRequiredForRoleError extends Error {
  constructor(
    public readonly fieldName: string,
    public readonly requiredRole: string,
  ) {
    super(
      `Field "${fieldName}" is required for user with role: ${requiredRole}`,
    );
    this.name = 'FieldRequiredForRoleError';
  }
}
