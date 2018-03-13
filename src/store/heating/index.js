const { createActions, handleActions } = require('redux-actions');
const { delay } = require('redux-saga');
const { all, fork } = require('redux-saga/effects');
const api = require('../../mqtt/api');

const UPDATE_DELAY = 10 * 1000; // update interval
const UPDATE_HEATING = 'UPDATE_HEATING';

const actions = createActions({
  [UPDATE_HEATING]: (value, timestamp, program) => ({ value, timestamp, program }),
});

const reducers = handleActions({
  [UPDATE_HEATING]: (state, { payload }) => state.replace(payload),
}, {});

function* requestHeatingUpdateSaga() {
  while (true) {
    api.requestHeatingUpdate();
    yield delay(UPDATE_DELAY);
  }
}

const sagas = function* main() {
  yield all([
    fork(requestHeatingUpdateSaga),
  ]);
};

module.exports = {
  reducers,
  actions,
  sagas,
  UPDATE_HEATING,
};
