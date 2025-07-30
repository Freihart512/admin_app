import { IDomainEvent } from '../IDomainEvent';

export interface PasswordResetSuccessfulPayload {
  userId: string;
  email: string;
  // Opcional: Información adicional
}

export class PasswordResetSuccessfulEvent implements IDomainEvent {
  public readonly type = 'PasswordResetSuccessfulEvent';
  public readonly timestamp: Date;
  public readonly payload: PasswordResetSuccessfulPayload;

  constructor(userId: string, email: string) {
    this.timestamp = new Date();
    this.payload = {
      userId: userId,
      email: email,
    };
  }
}
