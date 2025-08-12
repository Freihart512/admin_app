export class ServiceUnavailableError extends Error {
  constructor(message: string = 'Service is currently unavailable.') {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}