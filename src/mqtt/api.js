const ENV = require('../config/env');
const server = require('./index');

module.exports = {
  requestSensorUpdate: () => server.publish(`${ENV.TOPIC_TEMPERATURE}/in`, 'status'),
  requestHeatingUpdate: () => server.publish(`${ENV.TOPIC_HEATING}/in`, 'status'),
  setHeating: on => server.publish(`${ENV.TOPIC_HEATING}/in`, on ? 'on' : 'off'),
  publishStatus: status => server.publish(`${ENV.SERVER_TOPIC}/${ENV.ETOPIC_STATUS}/out`, JSON.stringify(status)),
  dummy: () => {},
};
