const { plugin } = require('..');
const assert = require('assert').strict;
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { bindHooks, getViewport, setViewport } = require('../src/utils');

describe('utils', () => {
  let driver = null;

  beforeEach(async function () {
    const options = new Options();
    if (!this.test.title.includes('headful')) {
      options.addArguments('headless');
    }
    driver = await plugin.launch({ builder: new Builder().setChromeOptions(options) });
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe('#getViewport()', () => {
    ['headless', 'headful'].forEach((type) => {
      it(`should return the ${type} browser viewport size`, async () => {
        const viewport = await getViewport(driver);

        assert.ok(viewport, 'Viewport should not be null');
        assert.equal(typeof viewport, 'object', 'Viewport should be an object');
        assert.equal(typeof viewport.width, 'number', 'Viewport width should be a number');
        assert.equal(typeof viewport.height, 'number', 'Viewport height should be a number');
      });
    });
  });

  describe('#setViewport()', () => {
    ['headless', 'headful'].forEach((type) => {
      it(`should change the ${type} browser viewport size`, async () => {
        for (let step = 5; step <= 10; ++step) {
          const viewport = { width: step * 100, height: step * 100 };
          await setViewport(driver, viewport);

          assert.deepEqual(await getViewport(driver), viewport, `Viewport should be ${JSON.stringify(viewport)}`);
        }
      });
    });
  });

  describe('#bindHooks()', () => {
    it('should correctly modify original methods', async () => {
      bindHooks(driver);
      try {
        await driver.switchTo().newWindow('window');
      } catch (error) {
        assert.fail(`Window creation failed: ${error.message}`);
      }

      assert.equal(driver.manage().constructor.name, 'Options');
      assert.equal(driver.manage().window().constructor.name, 'Window');
      assert.equal(driver.switchTo().constructor.name, 'TargetLocator');
    });

    it('should prevent viewport resizing', async () => {
      bindHooks(driver);
      const viewport = { width: 100, height: 100 };

      for (let i = 0; i < 2; ++i) {
        if (i > 0) await driver.manage().window().setRect(viewport);
        assert.notDeepEqual(await getViewport(driver), viewport, 'Viewport should not equal the restricted size');
      }
    });

    describe('page creation hook', () => {
      it('should execute a callback before page creation', async () => {
        const waitForHook = new Promise((resolve) => {
          bindHooks(driver, { onPageCreated: () => resolve() });
        });

        const result = await Promise.race([waitForHook, driver.switchTo().newWindow('window')]);
        assert.equal(result, undefined, 'Callback should execute before new window is created');
      });
    });
  });
});
