import { IDomainEvent } from '../IDomainEvent';

export interface PasswordChangedPayload {
  userId: string;
  email: string;
  // Opcional: Información adicional
}

export class PasswordChangedEvent implements IDomainEvent {
  public readonly type = 'PasswordChangedEvent';
  public readonly timestamp: Date;
  public readonly payload: PasswordChangedPayload;

  constructor(userId: string, email: string) {
    this.timestamp = new Date();
    this.payload = {
      userId: userId,
      email: email,
    };
  }
}
