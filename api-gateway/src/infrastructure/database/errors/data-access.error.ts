
export class DataAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataAccessError";
  }
}
