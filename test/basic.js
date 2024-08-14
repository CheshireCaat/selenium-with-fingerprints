const { plugin } = require('..');
const assert = require('assert').strict;
const { FingerprintPlugin } = require('browser-with-fingerprints');

describe('plugin', () => {
  describe('instance', () => {
    it('should be an object', () => {
      assert.ok(plugin, 'Plugin should not be null');
      assert.equal(typeof plugin, 'object', 'Plugin should be an object');
    });

    it('should be an instance of the base class', () => {
      assert.equal(
        Object.getPrototypeOf(plugin.constructor),
        FingerprintPlugin,
        'Plugin should inherit from FingerprintPlugin'
      );
    });

    it('should be an instance of "SeleniumFingerprintPlugin"', () => {
      assert.equal(
        plugin.constructor.name,
        'SeleniumFingerprintPlugin',
        'Plugin constructor name should be SeleniumFingerprintPlugin'
      );
    });

    it('should have a default launcher', () => {
      assert.ok(plugin.launcher, 'Launcher should not be null');
      assert.equal(typeof plugin.launcher.launch, 'function', 'Launcher should have a launch function');
      assert.equal(plugin.launcher.constructor.name, 'Object', 'Launcher should be an object');
    });

    it('should have all methods from the base plugin', () => {
      const baseMethods = Object.getOwnPropertyNames(FingerprintPlugin.prototype);
      baseMethods.forEach((method) => {
        assert.ok(method in plugin, `Plugin should have method: ${method}`);
      });
    });
  });
});
