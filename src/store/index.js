const { createStore, combineReducers, bindActionCreators } = require('redux');
const Immutable = require('seamless-immutable');
const heating = require('./heating');
const sensors = require('./sensors');

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
);

module.exports = {
  store,
  actions: {
    ...bindActionCreators(sensors.actions, store.dispatch),
    ...bindActionCreators(heating.actions, store.dispatch),
  },
};
