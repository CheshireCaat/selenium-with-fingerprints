const { plugin } = require('..');
const assert = require('assert').strict;
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

describe('plugin', () => {
  describe('#launch()', () => {
    it('should return the same type as vanilla "selenium" package', async () => {
      const driver = await plugin.launch(new Builder().setChromeOptions(new Options().addArguments('headless')));

      assert.notEqual(driver, null);
      assert.equal(driver.constructor.name, 'Driver');

      await driver.quit();
    });
  });

  it('should work with browser normally', async () => {
    await assert.doesNotReject(async () => {
      const driver = await plugin.launch(new Builder().setChromeOptions(new Options().addArguments('headless')));

      await driver.get('https://example.com/');

      await driver.quit();
    });
  });
});
