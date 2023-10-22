describe('Example', () => {
  beforeAll(async () => {
    // await device.reloadReactNative(); // not stable
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {});

  // it('should open app', async () => {
  //   element(by.id('YourTestID'));
  // });

  it('should tap on a button', async () => {
    await element(by.id('LearnMoreButton')).tap();
    await expect(element(by.text('Learn more pressed'))).toBeVisible();
  });
});
