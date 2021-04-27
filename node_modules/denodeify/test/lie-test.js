delete global.Promise;
global.Promise = require('lie');

var helpers = require('./helpers');

describe('denodeify with lie', helpers.basicDenodeify);
describe('denodeify with lie using multiple arguments', helpers.multipleArguments);
