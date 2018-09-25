const CFG = require('./src/config');
const moment = require('moment');
const configParser = require('temperature-config-parser');
const server = require('./src/mqtt');
const { state, actions } = require('./src/store');
const storage = require('./src/storage');
require('./src/storage/history'); // init db
const { logState, getHistory } = require('./src/storage/history/repo');

// internal
server.listen(`${CFG.TOPIC_HEATING}/out`, message => actions.updateHeating(
  parseInt(message, 10),
  moment().format(),
  configParser.getProgram(storage.schedule.getActive()),
));
server.listen(`${CFG.TOPIC_TEMPERATURE}/out`, (message) => {
  const response = JSON.parse(message);
  const { id, temperature, humidity, timestamp } = response;
  actions.updateSensors(id, { temperature, humidity, timestamp: moment(timestamp).format() });
});
// endpoints
server.sub(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_SCHEDULES}/get/in`, null, () => JSON.stringify(storage.schedule.getAll()));
server.sub(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_SCHEDULES}/set/in`, `${CFG.SERVER_TOPIC}/${CFG.ETOPIC_SCHEDULES}/get/out`, (message) => {
  const schedules = JSON.parse(message);
  Object.entries(schedules).forEach(([id, schedule]) => storage.schedule.set(id, schedule));
  return JSON.stringify(storage.schedule.getAll());
});
server.sub(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_STATUS}/in`, null, () => JSON.stringify({
  ...state(),
  program: configParser.getProgram(storage.schedule.getActive()),
}));

server.res(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_HISTORY}/get/in`, ({ start, end, interval }) => getHistory(start, end, interval));

setInterval(() => logState(state()), CFG.STATE_LOG_INTERVAL * 1000);
