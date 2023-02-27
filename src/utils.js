const { scripts } = require('browser-with-fingerprints/src/common');

/**
 * Add an event listener for the browser's `close` event.
 *
 * @param {import('selenium-webdriver').WebDriver} target - The listener target.
 * @param {(() => void)} listener - The event listener.
 *
 * @internal
 */
exports.onClose = (target, listener) => {
  target.onQuit_ = new Proxy(target.onQuit_, {
    apply: (fn, ctx, args) => (listener(), fn.apply(ctx, args)),
  });
};

/**
 * Modify the original browser methods and add additional hooks.
 * Hooks will be called before the corresponding method completes.
 *
 * @param {import('selenium-webdriver').WebDriver} driver - The target browser instance.
 *
 * @internal
 */
exports.bindHooks = (driver, hooks = {}) => {
  driver.switchTo = new Proxy(driver.switchTo, {
    apply(fn, ctx) {
      const target = fn.call(ctx);

      target.newWindow = new Proxy(target.newWindow, {
        async apply(fn, ctx, [type]) {
          await fn.call(ctx, type);
          if (type === 'window') {
            await hooks.onPageCreated?.(driver);
          }
        },
      });

      return target;
    },
  });

  driver.manage = new Proxy(driver.manage, {
    apply(fn, ctx) {
      const options = fn.call(ctx);

      options.window = new Proxy(options.window, {
        apply(fn, ctx) {
          const window = fn.call(ctx);

          window.setRect = new Proxy(window.setRect, {
            apply: () => console.warn('Warning: setting the viewport size is not allowed (limited by fingerprint).'),
          });

          return window;
        },
      });

      return options;
    },
  });
};

/**
 * Set the browser viewport size.
 *
 * @param {import('selenium-webdriver').WebDriver}} driver - The target driver to set the viewport.
 * @param {{width: number, height: number}} bounds - New viewport size.
 *
 * @internal
 */
exports.setViewport = async (driver, { width = 0, height = 0 }) => {
  const delta = { width: 16, height: 88 };

  const { windowId } = await driver.sendAndGetDevToolsCommand('Browser.getWindowForTarget');

  for (let i = 0; i < MAX_RESIZE_RETRIES; ++i) {
    const bounds = { width: width + delta.width, height: height + delta.height };
    await Promise.all([
      driver.sendDevToolsCommand('Browser.setWindowBounds', { bounds, windowId }),
      waitForResize(driver),
    ]);

    const viewport = await this.getViewport(driver);

    if (width === viewport.width && height === viewport.height) {
      break;
    } else if (i === MAX_RESIZE_RETRIES - 1) {
      throw new Error('Unable to set correct viewport size.');
    }

    delta.height += height - viewport.height;
    delta.width += width - viewport.width;
  }
};

/**
 * Get the browser viewport size.
 *
 * @param {import('selenium-webdriver').WebDriver} driver - The target driver to get the viewport.
 * @returns {Promise<{width: number, height: number}>} - Promise which resolves to a browser viewport size.
 *
 * @internal
 */
exports.getViewport = (driver) => driver.executeScript(scripts.getViewport);

/**
 * Wait for the browser to resize.
 *
 * @param {import('selenium-webdriver').WebDriver} driver - The target driver to to wait for the browser to resize.
 */
const waitForResize = (driver) => driver.executeScript(scripts.waitForResize);

const MAX_RESIZE_RETRIES = 2;
