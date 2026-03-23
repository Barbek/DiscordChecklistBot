const fs = require('fs');
const path = require('path');

const LOCAL_PREMADES_PATH = path.join(__dirname, '../config/checklists.json');
const EXAMPLE_PREMADES_PATH = path.join(__dirname, '../config.example/checklists.json');

function readPremades(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadPremades() {
  if (fs.existsSync(LOCAL_PREMADES_PATH)) {
    return readPremades(LOCAL_PREMADES_PATH);
  }

  if (fs.existsSync(EXAMPLE_PREMADES_PATH)) {
    return readPremades(EXAMPLE_PREMADES_PATH);
  }

  throw new Error('Missing checklists.json in config and config.example');
}

module.exports = {
  loadPremades,
};
