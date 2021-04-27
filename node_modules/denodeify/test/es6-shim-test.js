delete global.Promise;
require('es6-shim');

var helpers = require('./helpers');

describe('denodeify with es6 shim', helpers.basicDenodeify);
describe('denodeify with es6 shim using multiple arguments', helpers.multipleArguments);
