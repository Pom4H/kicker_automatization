import { IServiceDiscovery } from './IServiceDiscovery';

type ServicesConfig = {[key: string]: string; };

export class ServiceDiscovery implements IServiceDiscovery {
  protected services: ServicesConfig;

  constructor(services: ServicesConfig) {
    this.services = services;
  }

  public location(serviceName: string): string | undefined {
    return this.services[serviceName];
  }
}
