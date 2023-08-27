require('chromedriver');
// require('dotenv').config();

// Replace this import with `require('..')` if you are running the example from the repository:
const { plugin } = require('selenium-with-fingerprints');
const { Options } = require('selenium-webdriver/chrome');
const { Builder, until, By } = require('selenium-webdriver');

// The default proxy value is just an example, it won't work.
const proxy = process.env.FINGERPRINT_PROXY ?? 'socks5://127.0.0.1:9762';

(async () => {
  plugin.useProxy(proxy, {
    detectExternalIP: false,
    changeGeolocation: true,
  });

  const driver = await plugin.launch(
    new Builder().setChromeOptions(
      new Options().addArguments([
        // This argument will be ignored if the `useProxy` method has been called.
        `--proxy-server=${proxy}`,
        '--headless',
      ])
    )
  );

  await driver.get('https://canhazip.com/');
  const pre = await driver.wait(until.elementLocated(By.css('pre')));

  console.log('External IP:', await pre.getText());

  await driver.quit();
})();
