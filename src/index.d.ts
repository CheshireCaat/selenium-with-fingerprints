import type { Builder, WebDriver } from 'selenium-webdriver';
import type { FingerprintPlugin } from 'browser-with-fingerprints';

/**
 * Launcher options that only apply to the browser when using the `launch` method.
 */
export type LaunchOptions = {
  /**
   * An instance of the builder that will be used to launch the browser.
   */
  builder?: Builder;

  /**
   * Service key for applying a fingerprint.
   *
   * @default ''
   */
  // key?: string;
};

/**
 * Describes a plugin that is capable of fetching a fingerprint and launching a browser instance using it.
 *
 * @remarks
 * **NOTE**: This plugin works correctly only with the **selenium** framework.
 */
export interface SeleniumFingerprintPlugin extends FingerprintPlugin {
  /**
   * Launches **selenium** and launches a browser instance with given arguments and options when specified.
   *
   * This method uses the selenium's native {@link Builder.build | build} method under the hood and adds some functionality for applying fingerprints and proxies.
   * Before launching, the parameters that you specified using the {@link useProxy} and {@link useFingerprint} methods will also be applied for the browser.
   *
   * If you need more information on how the native method works, use the **selenium** documentation for the
   * [builder](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Builder.html)
   * and
   * [options](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/chrome_exports_Options.html).
   *
   * @remarks
   * **NOTE**: This plugin only works with the `chromium` browser, which comes bundled with the plugin.
   * You will not be able to use default `chromium`, `firefox`, `webkit` and other engines that come with the **selenium** framework.
   *
   * If you need to use the default browsers without fingerprint spoofing, just use the **selenium** built-in methods.
   *
   * You must specify the service key to apply the fingerprint when launching the browser (if the fingerprint was obtained using a paid key).
   *
   * @example
   * An example of launching the browser in visible mode:
   *
   * ```js
   * const driver = await plugin.launch({
   *   builder: new webdriver.Builder().setAlertBehavior('ignore'),
   * });
   * ```
   *
   * @param options - Set of configurable options to set on the browser.
   * @returns Promise which resolves to a browser instance.
   */
  launch(options?: LaunchOptions): Promise<WebDriver>;
}

/**
 * A default instance of the fingerprint plugin for the **selenium** library.
 * It comes with a pre-configured launcher and is the easiest option to use.
 *
 * The default instance itself imports and uses the necessary dependencies, so you can replace
 * the **selenium** imports with a plugin if you don't need additional options.
 */
export declare const plugin: SeleniumFingerprintPlugin;
