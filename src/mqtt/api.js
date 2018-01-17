const server = require('./index');

module.exports = {
  requestSensorUpdate: () => server.publish('sensors/temperature/in', 'status'),
  requestHeatingUpdate: () => server.publish('/heating/in', 'status'),
  setHeating: on => server.publish('/heating/in', on ? 'on' : 'off'),
  dummy: on => console.log('@dummy', on),
};
