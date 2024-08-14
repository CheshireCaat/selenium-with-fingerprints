require('chromedriver');
// require('dotenv').config();

// Replace this import with `require('..')` if you are running the example from the repository:
const { plugin } = require('selenium-with-fingerprints');
const { until, By } = require('selenium-webdriver');

const key = process.env.FINGERPRINT_KEY ?? '';

(async () => {
  for (let i = 0; i < 2; ++i) {
    const fingerprint = await plugin.fetch(key, { tags: ['Microsoft Windows', 'Chrome'] });
    const driver = await plugin.useFingerprint(fingerprint).launch({ key });

    await driver.get('https://httpbin.org/headers');
    const pre = await driver.wait(until.elementLocated(By.css('pre')));

    const { headers } = JSON.parse(await pre.getText());

    console.log(`Browser №${i + 1}:`, {
      headers: {
        userAgent: headers['User-Agent'],
        acceptLanguage: headers['Accept-Language'],
      },
      viewport: await driver.executeScript(() => ({ width: innerWidth, height: innerHeight })),
    });

    await driver.quit();
  }
})();
