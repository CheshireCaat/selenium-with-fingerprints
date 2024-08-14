const { plugin } = require('..');
const assert = require('assert').strict;
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

describe('plugin', () => {
  let driver;

  before(async () => {
    const options = new Options();
    options.addArguments('headless');
    driver = await plugin.launch({ builder: new Builder().setChromeOptions(options) });
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe('#launch()', () => {
    it('should return the same type as vanilla "selenium" package', async () => {
      assert.ok(driver, 'Driver should not be null');
      assert.equal(driver.constructor.name, 'Driver', 'Driver should be an instance of Selenium Driver');
    });
  });

  it('should work with browser normally', async () => {
    try {
      await driver.get('https://example.com/');
    } catch (error) {
      assert.fail(`Browser navigation failed: ${error.message}`);
    }
  });
});
