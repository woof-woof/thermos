const ENV = require('./src/config/env');
const moment = require('moment');
const configParser = require('temperature-config-parser');
require('./src/config/env');
const server = require('./src/mqtt');
const { state, actions } = require('./src/store');
const storage = require('./src/storage');
require('./src/storage/history'); // init db
const { logState, getHistory } = require('./src/storage/history/repo');

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
server.sub(`${ENV.SERVER_TOPIC}/${ENV.ETOPIC_SCHEDULES}/get/in`, null, () => JSON.stringify(storage.schedule.getAll()));
server.sub(`${ENV.SERVER_TOPIC}/${ENV.ETOPIC_SCHEDULES}/set/in`, `${ENV.SERVER_TOPIC}/${ENV.ETOPIC_SCHEDULES}/get/out`, (message) => {
  const schedules = JSON.parse(message);
  Object.entries(schedules).forEach(([id, schedule]) => storage.schedule.set(id, schedule));
  return JSON.stringify(storage.schedule.getAll());
});
server.sub(`${ENV.SERVER_TOPIC}/${ENV.ETOPIC_STATUS}/in`, null, () => JSON.stringify({
  ...state(),
  program: configParser.getProgram(storage.schedule.getActive()),
}));

server.res(`${ENV.SERVER_TOPIC}/${ENV.ETOPIC_HISTORY}/get/in`, ({ start, end, interval }) => getHistory(start, end, interval));

setInterval(() => logState(state()), ENV.SATE_LOG_INTERVAL);
