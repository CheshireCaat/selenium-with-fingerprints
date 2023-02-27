const Loader = require('browser-with-fingerprints/src/loader');

/**
 * The loader instance for the `selenium` framework.
 *
 * The minimum required framework version is `4.5.0`.
 *
 * @internal
 */
exports.loader = new Loader('selenium-webdriver', '4.5.0', []);
