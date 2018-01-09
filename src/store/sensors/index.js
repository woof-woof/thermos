const { createActions, handleActions } = require('redux-actions');

const UPDATE_SENSORS = 'UPDATE_SENSORS';

const actions = createActions({
  [UPDATE_SENSORS]: (id, response) => ({ id, response }),
});

const reducers = handleActions({
  [UPDATE_SENSORS]: (state, { payload: { id, response } }) => state.set(id, response),
}, {});

module.exports = {
  reducers,
  actions,
};
