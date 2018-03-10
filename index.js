require('dotenv').config();
const moment = require('moment');
const configParser = require('temperature-config-parser');
const server = require('./src/mqtt');
const { state, actions } = require('./src/store');
const storage = require('./src/storage');
require('./src/storage/history'); // init db
const { logState, getHistory } = require('./src/storage/history/repo');

const SERVER_NAME = 'thermos';
// internal
server.listen('/heating/out', message => actions.updateHeating(
  parseInt(message, 10),
  moment().format(),
  configParser.getProgram(storage.schedule.getActive()),
));
server.listen('sensors/temperature/out', (message) => {
  const response = JSON.parse(message);
  const { id, temperature, humidity, timestamp } = response;
  actions.updateSensors(id, { temperature, humidity, timestamp: moment(timestamp).format() });
});
// endpoints
server.sub(`${SERVER_NAME}/schedules/get/in`, null, () => JSON.stringify(storage.schedule.getAll()));
server.sub(`${SERVER_NAME}/schedules/set/in`, `${SERVER_NAME}/schedules/get/out`, (message) => {
  const schedules = JSON.parse(message);
  Object.entries(schedules).forEach(([id, schedule]) => storage.schedule.set(id, schedule));
  return JSON.stringify(storage.schedule.getAll());
});
server.sub(`${SERVER_NAME}/status/in`, null, () => JSON.stringify({
  ...state(),
  program: configParser.getProgram(storage.schedule.getActive()),
}));

server.res(`${SERVER_NAME}/history/get/in`, ({ start, end, interval }) => JSON.stringify(getHistory(start, end, interval)));

setInterval(() => logState(state()), process.env.SATE_LOG_INTERVAL || 10 * 60 * 1000);

