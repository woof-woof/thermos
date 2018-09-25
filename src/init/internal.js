const CFG = require('../config');
const moment = require('moment');
const configParser = require('temperature-config-parser');
const server = require('../mqtt');
const { actions } = require('../store');
const storage = require('../storage');

function heatingHandler(message) {
  actions.updateHeating(
    parseInt(message, 10),
    moment().format(),
    configParser.getProgram(storage.schedule.getActive()),
  );
}

function temperatureHandler(message) {
  const response = JSON.parse(message);
  const { id, temperature, humidity, timestamp } = response;
  actions.updateSensors(id, { temperature, humidity, timestamp: moment(timestamp).format() });
}

module.exports = () => {
  server.listen(`${CFG.TOPIC_HEATING}/out`, heatingHandler);
  server.listen(`${CFG.TOPIC_TEMPERATURE}/out`, temperatureHandler);
};
