const CFG = require('./src/config');
const { state } = require('./src/store');
require('./src/storage/history'); // init db
const { logState } = require('./src/storage/history/repo');
const init = require('./src/init');

init.internal();
init.mqtt();

setInterval(() => logState(state()), CFG.STATE_LOG_INTERVAL * 1000);
