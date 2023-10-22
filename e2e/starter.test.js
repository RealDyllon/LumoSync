describe('Example', () => {
  beforeAll(async () => {
    await device.installApp();
    await device.launchApp();
    debugger;
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have AppRoot', async () => {
    await expect(element(by.id('AppRoot'))).toBeVisible();
  });

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });
  //
  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});
