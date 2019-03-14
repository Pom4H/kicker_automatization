export interface IServiceDiscovery {
  location(serviceName: string): string | undefined;
}
