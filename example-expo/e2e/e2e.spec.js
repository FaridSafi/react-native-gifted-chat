const { reloadApp } = require('detox-expo-helpers');

const composerId = 'Type a message...';
const sendId = 'send';
const timeout = 3000;

async function expectTypeText(text) {
  await waitFor(element(by.id(composerId)))
    .toBeVisible()
    .withTimeout(timeout);
  await element(by.id(composerId)).tap();
  await element(by.id(composerId)).typeText(text);
  await waitFor(element(by.id(sendId)))
    .toBeVisible()
    .withTimeout(timeout);
  await element(by.id(sendId)).tap();
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .withTimeout(timeout);
}

describe('GiftedChat', () => {
  beforeAll(async () => {
    await reloadApp();
  });

  it('should have main screen', async () => {
    await waitFor(element(by.id('main')))
      .toBeVisible()
      .withTimeout(timeout);
  });

  it('should type text 1', async () => {
    await expectTypeText('Are you building a chat app?');
  });

  it('should type text 2', async () => {
    await expectTypeText('Where are you?');
  });

  it('should type text 3', async () => {
    await expectTypeText('Send me a picture!');
  });

  it('should type text 4', async () => {
    await expectTypeText('#awesome !!!');
  });

  it('should type text 5', async () => {
    await expectTypeText("Will *Star GiftedChat's repo!");
  });
});
