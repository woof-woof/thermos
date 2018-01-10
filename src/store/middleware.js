const { default: createSagaMiddleware } = require('redux-saga');
const log = require('../log');

const logMiddleware = store => next => (action) => {
  next(action);
  log.info({ state: store.getState() }, action.type);
};

const sagaMiddleware = createSagaMiddleware();

module.exports = {
  logMiddleware,
  sagaMiddleware,
};
