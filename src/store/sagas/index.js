const configParser = require('temperature-config-parser');
const { all, select, takeLatest, throttle } = require('redux-saga/effects');
const storage = require('../../storage');
const api = require('../../mqtt/api');
const { heatingControl, HEATING_ON, NO_ACTION } = require('../../behaviour');
const { UPDATE_HEATING } = require('../heating');
const { UPDATE_SENSORS } = require('../sensors');

function* heatingControlSaga() {
  const heating = yield select(state => state.heating.value);
  const current = yield select(state => Object.values(state.sensors).map(s => s.temperature));
  const override = storage.override.getActive();
  if (override) {
    if (!heating) api.setHeating(true);
  } else {
    const { temperature } = configParser.getProgram(storage.schedule.getActive());
    const action = yield heatingControl(current, heating, temperature, storage.config.get());
    if (action !== NO_ACTION) api.setHeating(action === HEATING_ON);
  }
}

function* publishStatusSaga() {
  const status = yield select(state => state);
  api.publishStatus(status);
}

const sagas = function* main() {
  yield all([
    takeLatest([UPDATE_HEATING, UPDATE_SENSORS], heatingControlSaga),
    throttle(10000, [UPDATE_HEATING, UPDATE_SENSORS], publishStatusSaga),
  ]);
};

module.exports = sagas;
