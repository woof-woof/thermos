const CFG = require('../config');
const server = require('./index');

module.exports = {
  requestSensorUpdate: () => server.publish(`${CFG.TOPIC_TEMPERATURE}/in`, 'status'),
  requestHeatingUpdate: () => server.publish(`${CFG.TOPIC_HEATING}/in`, 'status'),
  setHeating: on => server.publish(`${CFG.TOPIC_HEATING}/in`, on ? 'on' : 'off'),
  publishStatus: status => server.publish(`${CFG.SERVER_TOPIC}/${CFG.ETOPIC_STATUS}/out`, JSON.stringify(status)),
  dummy: () => {},
};
