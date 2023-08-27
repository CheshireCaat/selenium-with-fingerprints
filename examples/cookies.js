require('chromedriver');
// require('dotenv').config();

// Replace this import with `require('..')` if you are running the example from the repository:
const { plugin } = require('selenium-with-fingerprints');
const { until, By } = require('selenium-webdriver');

(async () => {
  const driver = await plugin.launch();

  await driver.get('https://google.com');
  await driver.wait(until.elementLocated(By.css('form[action]')));

  // By default selenium saves cookies only for the current domain.
  // We can use `CDP` commands to get all browser cookies.
  const { cookies } = await driver.sendAndGetDevToolsCommand('Storage.getCookies');
  console.log('Cookies:', cookies);

  // Other methods of interacting with cookies in selenium also work within the current domain.
  // So, for example, you can also use `CDP` to import/clear all browser cookies:
  await driver.sendDevToolsCommand('Storage.clearCookies');

  await driver.quit();
})();
