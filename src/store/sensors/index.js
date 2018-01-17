const { createActions, handleActions } = require('redux-actions');
const { delay } = require('redux-saga');
const { all, takeLatest } = require('redux-saga/effects');
const api = require('../../mqtt/api');

const UPDATE_SENSORS = 'UPDATE_SENSORS';
const UPDATE_DELAY = 4000; // force an update every 4 seconds

const actions = createActions({
  [UPDATE_SENSORS]: (id, response) => ({ id, response }),
});

const reducers = handleActions({
  [UPDATE_SENSORS]: (state, { payload: { id, response } }) => state.set(id, response),
}, {});

function* requestSensorUpdate() {
  yield delay(UPDATE_DELAY);
  api.requestSensorUpdate();
}

const sagas = function* main() {
  yield all([
    takeLatest(UPDATE_SENSORS, requestSensorUpdate),
  ]);
};

module.exports = {
  reducers,
  actions,
  sagas,
  UPDATE_SENSORS,
};
