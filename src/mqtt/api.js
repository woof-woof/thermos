const { client } = require('./index');

module.exports = {
  requestSensorUpdate: () => client.publish('sensors/temperature/in', 'status'),
  requestHeatingUpdate: () => client.publish('/heating/in', 'status'),
};
