require('dotenv').config();
const moment = require('moment');
const server = require('./src/mqtt');
const { actions } = require('./src/store');

server.listen('/heating/out', message => actions.updateHeating(parseInt(message, 10), moment().format()));
server.listen('sensors/temperature/out', (message) => {
  const response = JSON.parse(message);
  const { id, temperature, humidity, timestamp } = response;
  actions.updateSensors(id, { temperature, humidity, timestamp: moment(timestamp).format() });
});
