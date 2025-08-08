export const RFCValidationReason = {
  InvalidFormat: 'INVALID_FORMAT',
  Empty: 'EMPTY',
} as const;

export type RFCValidationReasonType = typeof RFCValidationReason[keyof typeof RFCValidationReason];

export class InvalidRFCError extends Error {
  constructor(
    public readonly value: string,
    public readonly reason: RFCValidationReasonType
  ) {
    super(`Invalid RFC: "${value}" – ${reason}`);
    this.name = 'InvalidRFCError';
  }
}