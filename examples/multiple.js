require('chromedriver');
require('dotenv').config();

const { plugin } = require('..');
const { until, By } = require('selenium-webdriver');

(async () => {
  const key = process.env.FINGERPRINT_KEY ?? '';

  for (let i = 0; i < 2; ++i) {
    const fingerprint = await plugin.fetch(key, { tags: ['Microsoft Windows', 'Chrome'] });
    const driver = await plugin.useFingerprint(fingerprint).launch();

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
