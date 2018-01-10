require('dotenv').config();
const Server = require('mqtt-server');
const { server: config } = require('../config');

const server = Server(config);

module.exports = {
  server,
  client: server.client,
};
