import { Container, interfaces, injectable } from 'inversify';
import inversifyInjectDecorators from 'inversify-inject-decorators';
import { Type } from './Type';

export const container = new Container();
export const inject: (
  serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>,
) => (proto: any, key: string) => void
  = inversifyInjectDecorators(container).lazyInject;
export { Type };
export { injectable };
