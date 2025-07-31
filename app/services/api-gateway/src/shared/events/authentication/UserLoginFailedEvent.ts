
import { IUserContextEvent } from '../IUserContextEvent';

export interface UserLoginFailedPayload {
  email: string;
  reason: string;
}
export class UserLoginFailedEvent implements IUserContextEvent<'UserLoginFailedEvent', UserLoginFailedPayload> {
  public readonly type = 'UserLoginFailedEvent';

  public readonly timestamp: Date;

  public readonly userId?: string;
  public readonly payload: UserLoginFailedPayload;

  constructor(payload: UserLoginFailedPayload, userId?: string) {
    this.timestamp = new Date();
    this.payload = payload;
    this.userId = userId;
  }
}
