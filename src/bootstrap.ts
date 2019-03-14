import { bootstrap } from './components/core/bootstrap';

bootstrap('KICKER_ENV');

import 'source-map-support/register';

const tsConfig = require('../tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
  baseUrl: __dirname,
  paths: tsConfig.compilerOptions.paths
});
