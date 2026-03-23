let currentConfig = null;

function setConfig(config) {
  currentConfig = config;
}

function getConfig() {
  if (!currentConfig) {
    throw new Error('Runtime config has not been initialized yet.');
  }

  return currentConfig;
}

module.exports = {
  setConfig,
  getConfig,
};