const { createActions, handleActions } = require('redux-actions');
const { delay } = require('redux-saga');
const { all, fork } = require('redux-saga/effects');
const api = require('../../mqtt/api');

const UPDATE_DELAY = 30 * 1000; // update interval
const UPDATE_SENSORS = 'UPDATE_SENSORS';

const actions = createActions({
  [UPDATE_SENSORS]: (id, response) => ({ id, response }),
});

const reducers = handleActions({
  [UPDATE_SENSORS]: (state, { payload: { id, response } }) => state.set(id, response),
}, {});

function* requestSensorUpdateSaga() {
  while (true) {
    api.requestSensorUpdate();
    yield delay(UPDATE_DELAY);
  }
}

const sagas = function* main() {
  yield all([
    fork(requestSensorUpdateSaga),
  ]);
};

module.exports = {
  reducers,
  actions,
  sagas,
  UPDATE_SENSORS,
};
