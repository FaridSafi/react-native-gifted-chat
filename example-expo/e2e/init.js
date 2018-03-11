const detox = require('detox');
const config = require('../package.json').detox;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;

beforeAll(async () => {
  await detox.init(config);
});

afterAll(async () => {
  await detox.cleanup();
});
