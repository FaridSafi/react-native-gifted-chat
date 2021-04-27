delete global.Promise;
require('es6-promise').polyfill();

var helpers = require('./helpers');

describe('denodeify with es6 promise', helpers.basicDenodeify);
describe('denodeify with es6 promise using multiple arguments', helpers.multipleArguments);
