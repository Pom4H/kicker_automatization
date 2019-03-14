import { ServiceWrapper } from '../../components/restClient/ServiceWrapper';

export class CoreServiceWrapper extends ServiceWrapper {

  protected get serviceName(): string {
    return 'serverApi';
  }

}
