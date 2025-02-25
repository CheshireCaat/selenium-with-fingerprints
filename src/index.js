const defaultLauncher = require('./loader').load();
const { Builder } = require('selenium-webdriver/index');
const { Options } = require('selenium-webdriver/chrome');
const { FingerprintPlugin } = require('browser-with-fingerprints');
const { onClose, bindHooks, getViewport, setViewport } = require('./utils');

const Plugin = class SeleniumFingerprintPlugin extends FingerprintPlugin {
  constructor() {
    super({
      launch({ args = [], builder = {}, options = {}, executablePath = '' } = {}) {
        Object.assign(options.get(options.CAPABILITY_KEY), { args, binary: executablePath });

        return builder.forBrowser('chrome').setChromeOptions(options).build();
      },
    });
  }

  async launch(options = {}) {
    if (options instanceof Builder) {
      console.warn(
        'Warning: the provided options argument is an instance of Builder, which is deprecated - please, use the new syntax for options.'
      );
      options = { builder: options };
    }

    const { key, builder = new Builder() } = options;
    const chromeOptions = new Options(builder.getChromeOptions());
    const capability = chromeOptions.get(chromeOptions.CAPABILITY_KEY);

    for (const option of Object.keys(capability)) {
      if (option.includes('android')) {
        throw new Error(`The built-in "${option}" option is not supported in this plugin.`);
      }
    }

    const args = (capability.args ?? []).map((arg) => (arg.includes('--') ? arg : `--${arg}`));

    return await super.launch({ key, args, builder, options: chromeOptions, headless: args.includes('--headless') });
  }

  /**
   * Configures the browser, including viewport size, hook and event binding.
   *
   * @param {import('selenium-webdriver').WebDriver} driver - The target browser instance.
   * @param {{width: number, height: number}} bounds - The size of the viewport.
   * @param {Promise<void>} sync - Method for syncing browser settings.
   * @param {(target: any) => void} cleanup - The cleanup function.
   *
   * @internal
   */
  async configure(cleanup, driver, bounds, sync) {
    onClose(driver, () => cleanup(driver));

    // Resize pages only if size is set.
    if (bounds.width && bounds.height) {
      const resize = async (driver) => {
        const { width, height } = await getViewport(driver);

        if (width !== bounds.width || height !== bounds.height) {
          await sync(() => setViewport(driver, bounds));
        }
      };
      bindHooks(driver, { onPageCreated: resize });

      await resize(driver);
    }
  }
};

exports.plugin = new Plugin(defaultLauncher);
