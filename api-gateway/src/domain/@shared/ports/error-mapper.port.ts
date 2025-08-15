export interface ErrorMapperPort {
  map(err: unknown, ctx?: string): never;
  wrap<T>(promise: Promise<T>, ctx?: string): Promise<T>;
}
