'use strict';

module.exports = {
  require: ['dotenv/config', 'chromedriver'],
  inlineDiffs: true,
  timeout: '180s',
  exit: true,
};

process.env.NODE_ENV = 'test';
