const tcp = require('temperature-config-parser');
const { select } = require('redux-saga/effects');
const storage = require('../../storage');
const api = require('../../mqtt/api');
const { heatingControl, HEATING_ON, NO_ACTION } = require('../../behaviour');

function* heatingControlSaga() {
  const heating = yield select(state => state.heating.value);
  const current = yield select(state => Object.values(state.sensors).map(s => s.temperature));
  const { temperature } = tcp.getProgram(storage.schedule.getActive());
  const action = yield heatingControl(current, heating, temperature, storage.config.get());
  if (action !== NO_ACTION) api.dummy(action === HEATING_ON);
}

module.exports = {
  heatingControlSaga,
};
