require('chromedriver');
// require('dotenv').config();

// Replace this import with `require('..')` if you are running the example from the repository:
const { plugin } = require('selenium-with-fingerprints');
const { until, By } = require('selenium-webdriver');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey(process.env.FINGERPRINT_KEY ?? '');

async function main() {
  const fingerprint = await plugin.fetch({ tags: ['Microsoft Windows', 'Chrome'] });
  const driver = await plugin.useFingerprint(fingerprint).launch();

  const getText = (selector) =>
    driver.wait(until.elementLocated(By.css(selector))).then((el) => el.getAttribute('textContent'));
  await driver.get('https://browserleaks.com/javascript');

  const result = {
    screen: {
      width: await getText('#js-innerWidth'),
      height: await getText('#js-innerHeight'),
    },
    userAgent: await getText('#js-userAgent'),
    deviceMemory: await getText('#js-deviceMemory'),
    hardwareConcurrency: await getText('#js-hardwareConcurrency'),
  };

  await driver.quit();
  return result;
}

Promise.all([...Array(3).keys()].map(main)).then(console.log);
