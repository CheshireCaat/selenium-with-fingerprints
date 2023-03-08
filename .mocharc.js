module.exports = {
  require: ['dotenv/config', 'chromedriver'],
  inlineDiffs: true,
  timeout: '100s',
  exit: true,
};

process.env.NODE_ENV = 'test';
