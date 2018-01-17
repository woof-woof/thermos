const Server = require('mqtt-server');
const { server: config } = require('../config');

module.exports = Server(config);
