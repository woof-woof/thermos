const CFG = require('../config');
const configParser = require('temperature-config-parser');
const server = require('../mqtt');
const { state } = require('../store');
const storage = require('../storage');
const { getHistory } = require('../storage/history/repo');

function getSchedules() {
  return JSON.stringify(storage.schedule.getAll());
}

function setSchedules(message) {
  const schedules = JSON.parse(message);
  Object.entries(schedules).forEach(([id, schedule]) => storage.schedule.set(id, schedule));
  return JSON.stringify(storage.schedule.getAll());
}

function status() {
  return JSON.stringify({
    ...state(),
    program: configParser.getProgram(storage.schedule.getActive()),
  });
}

function history({ start, end, interval }) {
  return getHistory(start, end, interval);
}

module.exports = () => {
  server.sub(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_SCHEDULES}/get/in`, null, getSchedules);
  server.sub(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_SCHEDULES}/set/in`, `${CFG.SERVER_TOPIC}/${CFG.ETOPIC_SCHEDULES}/get/out`, setSchedules);
  server.sub(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_STATUS}/in`, null, status);
  server.res(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_HISTORY}/get/in`, history);
};
