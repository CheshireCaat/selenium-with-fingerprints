require('chromedriver');
// require('dotenv').config();

// Replace this import with `require('..')` if you are running the example from the repository:
const { plugin } = require('selenium-with-fingerprints');
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
