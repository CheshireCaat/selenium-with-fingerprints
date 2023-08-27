require('chromedriver');
// require('dotenv').config();

// Replace this import with `require('..')` if you are running the example from the repository:
const { plugin } = require('selenium-with-fingerprints');
const { Options } = require('selenium-webdriver/chrome');
const { Builder, until, By } = require('selenium-webdriver');

(async () => {
  const driver = await plugin.launch(
    new Builder().setChromeOptions(new Options().addArguments([`--user-data-dir=${__dirname}/profile`]))
  );

  await driver.get('chrome://version');

  const el = await driver.wait(until.elementLocated(By.id('profile_path')));
  console.log('Current profile:', await el.getText());

  await driver.quit();
})();
