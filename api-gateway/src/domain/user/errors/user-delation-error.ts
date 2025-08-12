export class UserDeletionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserDeletionError';
    }
}
