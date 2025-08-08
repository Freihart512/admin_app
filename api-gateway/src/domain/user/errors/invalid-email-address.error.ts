export const InvalidEmailReasons = {
    InvalidFormat: 'invalid_format',
    TooLong: 'too_long',
  } as const;
  
export type InvalidEmailReason = typeof InvalidEmailReasons[keyof typeof InvalidEmailReasons];

export class InvalidEmailAddress extends Error {
    constructor(
      public readonly value: string,
      public readonly reason: InvalidEmailReason
    ) {
      super(`Invalid email address (${reason}): "${value}"`);
      this.name = 'InvalidEmailAddress';
    }
  }
  