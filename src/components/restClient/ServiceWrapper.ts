import { di } from '@framework';
import { injectable } from 'inversify';
import { Type } from '../Type';
import { RestClient } from './RestClient';
import { IServiceDiscovery } from './IServiceDiscovery';

@injectable()
export abstract class ServiceWrapper {
  protected restClient: RestClient;
  @di.inject(Type.ServiceDiscovery)
  protected serviceDiscovery!: IServiceDiscovery;

  protected serviceUrl: string | undefined;
  protected serviceToken: string | undefined;

  constructor() {
    this.serviceUrl = this.serviceDiscovery.location(this!.serviceName);
    this.serviceToken = this.serviceDiscovery.location(this!.serviceToken!);
    if (!this.serviceUrl) {
      throw new Error(`Can't find service location for ${this!.serviceName}`);
    }
    this.restClient = new RestClient(this.serviceUrl, { Authorization: `Bearer ${this.serviceToken}` });
  }

    /**
     * Query attributes of type array will be joined to string, i.e. { id: [1, 2, 3] } => '?id=1,2,3'
     *
     * @param {string} url
     * @param {object} query
     * @returns {Promise<Response>}
     */
  public async get<Response>(url: string, query: object): Promise<Response> {
    return this.restClient.get<Response>(url, query);
  }

  public async post<Response>(url: string, body?: object): Promise<Response> {
    return this.restClient.post<Response>(url, body);
  }

  public async put<Response>(url: string, body?: object): Promise<Response> {
    return this.restClient.put<Response>(url, body);
  }

  public async patch<Response>(url: string, body?: object): Promise<Response> {
    return this.restClient.patch<Response>(url, body);
  }

  protected abstract get serviceName(): string;

}
