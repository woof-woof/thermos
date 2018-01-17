const constants = require('./constants');

function heatingControl(current, heating, target, options) {
  const { HEATING_ON, HEATING_OFF, NO_ACTION } = constants;
  const min = Math.min(...current);
  const { lowThreshold, highThreshold } = options;
  if (!heating && min < target - lowThreshold) return HEATING_ON;
  if (heating && min > target + highThreshold) return HEATING_OFF;
  return NO_ACTION;
}

module.exports = {
  heatingControl,
  ...constants,
};
