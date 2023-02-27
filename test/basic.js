const { plugin } = require('..');
const assert = require('assert').strict;
const { FingerprintPlugin } = require('browser-with-fingerprints');

describe('plugin', () => {
  describe('instance', () => {
    it('should be an object', () => {
      assert.notEqual(plugin, null);
      assert.equal(typeof plugin, 'object');
    });

    it('should be an instance of the base class', () => {
      assert.equal(Object.getPrototypeOf(plugin.constructor), FingerprintPlugin);
    });

    it('should be an instance of the "SeleniumFingerprintPlugin"', () => {
      assert.equal(plugin.constructor.name, 'SeleniumFingerprintPlugin');
    });

    it('should have a default launcher', () => {
      assert.notEqual(plugin.launcher, null);
      assert.equal(typeof plugin.launcher.launch, 'function');
      assert.equal(plugin.launcher.constructor.name, 'Object');
    });

    it('should have all methods from the base plugin', () => {
      for (const method of Object.getOwnPropertyNames(FingerprintPlugin.prototype)) {
        assert(method in plugin);
      }
    });
  });
});
