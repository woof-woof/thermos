const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'myapp' });
module.exports = log;
