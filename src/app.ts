import './bootstrap';
import { resolve } from 'path';
import { Application } from '@framework';
import { middlewares } from './components/middleware';
import { initContainer } from './initContainer';

const CONTROLLERS_PATH = resolve(__dirname, './application/controllers/**/*.js');

void initContainer().then(() => {
  const app = new Application([CONTROLLERS_PATH], middlewares);
  app.run();
});
