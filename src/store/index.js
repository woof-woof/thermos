const { createStore, combineReducers, bindActionCreators, applyMiddleware } = require('redux');
const { all, fork } = require('redux-saga/effects');
const Immutable = require('seamless-immutable');
const heating = require('./heating');
const sensors = require('./sensors');
const { sagaMiddleware, logMiddleware } = require('./middleware');

const initialState = Immutable.from({
  heating: {},
  sensors: {},
});

const store = createStore(
  combineReducers({
    heating: heating.reducers,
    sensors: sensors.reducers,
  }),
  initialState,
  applyMiddleware(sagaMiddleware, logMiddleware),
);

const { dispatch } = store;
const actions = {
  ...bindActionCreators(sensors.actions, dispatch),
  ...bindActionCreators(heating.actions, dispatch),
};

function* rootSaga() {
  yield all([
    fork(sensors.sagas),
    fork(heating.sagas),
  ]);
}

sagaMiddleware.run(rootSaga);

module.exports = {
  store,
  actions,
};
