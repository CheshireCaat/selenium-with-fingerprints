const { plugin } = require('..');
const assert = require('assert').strict;
const { setTimeout } = require('timers/promises');
const { Builder, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

describe('plugin', () => {
  let driver;

  before(async () => {
    plugin.useProxy(process.env.FINGERPRINT_PROXY || '');

    const options = new Options();
    options.addArguments('headless');
    driver = await plugin.launch({ builder: new Builder().setChromeOptions(options) });
  });

  after(async () => {
    plugin.useProxy('');

    if (driver) {
      await driver.close();
    }
  });

  it('should correctly open a new window in headless mode (puppeteer-with-fingerprints#117)', async () => {
    await driver.get('https://www.producthunt.com/products/etsy-geeks');

    const $link = await driver.findElement(By.css("a[href*='etsygeeks.org']"));

    await $link.click();
    await setTimeout(5000);

    const pages = await driver.getAllWindowHandles();
    await driver.switchTo().window(pages[pages.length - 1]);

    const currentUrl = await driver.getCurrentUrl();
    assert.notEqual(currentUrl, 'about:blank', 'The new page must be opened and loaded correctly.');
  });
});
