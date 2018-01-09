const { createActions, handleActions } = require('redux-actions');

const UPDATE_HEATING = 'UPDATE_HEATING';

const actions = createActions({
  [UPDATE_HEATING]: (value, timestamp) => ({ value, timestamp }),
});

const reducers = handleActions({
  [UPDATE_HEATING]: (state, { payload }) => state.replace(payload),
}, {});

module.exports = {
  reducers,
  actions,
};
