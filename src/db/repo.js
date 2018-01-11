const { Config } = require('./schema');

async function getConfig() {
  return Config.findOrCreate({
    where: { id: 1 },
    defaults: {
      id: 1,
      value: JSON.stringify({
        lowThreshold: 0.3,
        highThreshold: 0,
        minTemp: 10,
        maxTemp: 26,
      }),
    },
  })
    .spread((user) => {
      const result = user.get({ plain: true });
      return JSON.parse(result.value);
    });
}

async function updateConfig(config) {
  const stored = await Config.findOne({ where: { id: 1 } });
  stored.value = JSON.stringify(config);
  try {
    stored.save();
  } catch (err) {
    throw new Error('Error on saving config');
  }

  return config;
}

module.exports = {
  getConfig, updateConfig,
};
