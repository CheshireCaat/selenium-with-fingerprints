require('chromedriver');
require('dotenv').config();

const { plugin } = require('..');
const { writeFile } = require('fs/promises');

const key = process.env.FINGERPRINT_KEY ?? '';

(async () => {
  const fingerprint = await plugin.fetch(key, { tags: ['Microsoft Windows', 'Chrome'] });
  const driver = await plugin.useFingerprint(fingerprint).launch();

  await driver.get('https://bot.sannysoft.com/');
  await new Promise((fn) => setTimeout(fn, 5000));

  await writeFile(`${__dirname}/stealth.png`, await driver.takeScreenshot(), 'base64');
  await driver.quit();
})();
