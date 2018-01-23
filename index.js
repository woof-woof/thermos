require('dotenv').config();
const moment = require('moment');
const configParser = require('temperature-config-parser');
const server = require('./src/mqtt');
const { state, actions } = require('./src/store');
const storage = require('./src/storage');
// internal
server.listen('/heating/out', message => actions.updateHeating(parseInt(message, 10), moment().format()));
server.listen('sensors/temperature/out', (message) => {
  const response = JSON.parse(message);
  const { id, temperature, humidity, timestamp } = response;
  actions.updateSensors(id, { temperature, humidity, timestamp: moment(timestamp).format() });
});
// endpoints
server.sub('thermos/schedules/get/in', null, () => JSON.stringify(storage.schedule.getAll()));
server.sub('thermos/schedules/set/in', 'thermos/schedules/get/out', (message) => {
  const schedules = JSON.parse(message);
  Object.entries(schedules).forEach(([id, schedule]) => storage.schedule.set(id, schedule));
  return JSON.stringify(storage.schedule.getAll());
});
server.sub('thermos/status/in', null, () => JSON.stringify({
  ...state(),
  program: configParser.getProgram(storage.schedule.getActive()),
}));
