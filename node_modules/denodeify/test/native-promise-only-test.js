delete global.Promise;
require("native-promise-only");

var helpers = require('./helpers');

describe('denodeify with native promise only', helpers.basicDenodeify);
describe('denodeify with native promise only using multiple arguments', helpers.multipleArguments);
