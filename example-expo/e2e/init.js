const detox = require('detox');
const config = require('../package.json').detox;

before(async () => {
  await detox.init(config);
});

after(async () => {
  await detox.cleanup();
});