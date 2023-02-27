require('chromedriver');
require('dotenv').config();

const { plugin } = require('..');
const { until, By } = require('selenium-webdriver');

async function main(index) {
  const driver = await plugin.launch();

  await driver.get(`https://jsonplaceholder.typicode.com/todos/${index + 1}`);
  const pre = await driver.wait(until.elementLocated(By.css('pre')));

  const todo = JSON.parse(await pre.getText());

  await driver.quit();
  return todo;
}

Promise.all([...Array(3).keys()].map(main)).then((todos) => {
  console.log({ todos });
});
