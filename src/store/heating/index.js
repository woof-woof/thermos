const { createActions, handleActions } = require('redux-actions');
const { delay } = require('redux-saga');
const { all, takeLatest } = require('redux-saga/effects');
const api = require('../../mqtt/api');

const UPDATE_HEATING = 'UPDATE_HEATING';
const UPDATE_DELAY = 4000; // force an update every 4 seconds

const actions = createActions({
  UPDATE_HEATING: (value, timestamp) => ({ value, timestamp }),
});

const reducers = handleActions({
  UPDATE_HEATING: (state, { payload }) => state.replace(payload),
}, {});

function* requestHeatingUpdate() {
  yield delay(UPDATE_DELAY);
  api.requestHeatingUpdate();
}

const sagas = function* main() {
  yield all([
    takeLatest(UPDATE_HEATING, requestHeatingUpdate),
  ]);
};

module.exports = {
  reducers,
  actions,
  sagas,
};
