const { plugin } = require('..');
const assert = require('assert').strict;
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { bindHooks, getViewport, setViewport } = require('../src/utils');

describe('utils', () => {
  let driver = null;

  describe('#getViewport()', () => {
    ['headless', 'headful'].forEach((type) => {
      it(`should return the ${type} browser viewport size`, async () => {
        const viewport = await getViewport(driver);

        assert.notEqual(viewport, null);
        assert.equal(typeof viewport, 'object');
        assert.equal(typeof viewport.width, 'number');
        assert.equal(typeof viewport.height, 'number');
      });
    });
  });

  describe('#setViewport()', () => {
    ['headless', 'headful'].forEach((type) => {
      it(`should change the ${type} browser viewport size`, async () => {
        for (let step = 5; step <= 10; ++step) {
          const viewport = { width: step * 100, height: step * 100 };

          await setViewport(driver, viewport);

          assert.deepEqual(await getViewport(driver), viewport);
        }
      });
    });
  });

  describe('#bindHooks()', () => {
    it('should correctly modify original methods', async () => {
      bindHooks(driver);

      await assert.doesNotReject(async () => {
        await driver.switchTo().newWindow('window');
      });

      assert.equal(driver.manage().constructor.name, 'Options');
      assert.equal(driver.manage().window().constructor.name, 'Window');
      assert.equal(driver.switchTo().constructor.name, 'TargetLocator');
    });

    it('should prevent viewport resizing', async () => {
      bindHooks(driver);

      const viewport = { width: 100, height: 100 };

      for (let i = 0; i < 2; ++i) {
        if (i > 0) await driver.manage().window().setRect(viewport);

        assert.notDeepEqual(await getViewport(driver), viewport);
      }
    });

    describe('page creation hook', () => {
      it('should execute a callback before page creation', async () => {
        const waitForHook = new Promise((resolve) => {
          bindHooks(driver, { onPageCreated: () => resolve() });
        });

        assert.equal(await Promise.race([waitForHook, driver.switchTo().newWindow('window')]), void 0);
      });
    });
  });

  beforeEach(async function () {
    const options = new Options();
    if (!this.test.title.includes('headful')) options.headless();
    driver = await plugin.launch(new Builder().setChromeOptions(options));
  });

  afterEach(() => driver?.quit());
});
