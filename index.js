require('dotenv').config();
const moment = require('moment');
const { client } = require('./src/mqtt');
const { actions } = require('./src/store');
const { getConfig } = require('./src/db');
const log = require('./src/log');

client.subscribe('/heating/out');
client.subscribe('sensors/temperature/out');

client.on('/heating/out', message => actions.updateHeating(parseInt(message, 10), moment().format()));

client.on('sensors/temperature/out', (message) => {
  const response = JSON.parse(message);
  const { id, temperature, humidity, timestamp } = response;
  actions.updateSensors(id, { temperature, humidity, timestamp: moment(timestamp).format() });
});

getConfig().then((config) => {
  log.info(config, '@gotConfig');
});
