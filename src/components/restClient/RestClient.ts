import axios, { AxiosInstance } from 'axios';

import { BadRequestError, NotFoundError } from '../error';

interface Headers {
  [name: string]: string;
}

class RestClient {
  protected http: AxiosInstance;

  constructor(baseUrl: string, headers?: Headers) {
    this.http = axios.create({
      headers,
      baseURL: baseUrl
    });
  }

    /**
     * Query attributes of type array will be joined to string, i.e. { id: [1, 2, 3] } => '?id=1,2,3'
     *
     * @param {string} url
     * @param {object} query
     * @returns {Promise<Response>}
     */
  public async get<Response>(url: string, query: object = {}): Promise<Response> {
    const q: any = {};
    for (const param in query) {
      const value: any = (query as any)[param];
      q[param] = Array.isArray(value) ? value.join(',') : value;
    }
    try {
      return (await this.http.get(url, { params: q })).data;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  public async post<Response>(url: string, body?: object): Promise<Response> {
    try {
      return (await this.http.post(url, body)).data;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  public async put<Response>(url: string, body?: object): Promise<Response> {
    try {
      return (await this.http.put(url, body)).data;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  public async patch<Response>(url: string, body?: object): Promise<Response> {
    try {
      return (await this.http.patch(url, body)).data;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  protected handleError(e: Error | any): Error {
    if (e.response) {
      const message =
        `HTTP request to ${e.response.config.url} failed,` +
        ` response status: ${e.response.status} ${e.response.statusText},` +
        `body: ${JSON.stringify(e.response.data)}`;
      if (422 === e.response.status) {
        return new BadRequestError(message);
      }
      if (404 === e.response.status) {
        return new NotFoundError(message);
      }
    }
    return e;
  }

}

export { RestClient, Headers };
