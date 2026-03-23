/**
 * Config Loader with Secrets Registry Support
 * 1. Tries to load from local config/config.json first
 * 2. Falls back to fetching from GitHub Pages (secrets registry)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_LOCAL_PATH = path.join(__dirname, '../config/config.json');
const CONFIG_EXAMPLE_PATH = path.join(__dirname, '../config.example/config.json');

// GitHub Pages URL where generated config is served
const GITHUB_PAGES_URL = 'https://barbek.github.io/DiscordChecklistBot/config/config.json';

function loadLocalConfig() {
  try {
    if (fs.existsSync(CONFIG_LOCAL_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_LOCAL_PATH, 'utf8'));
      console.log('✅ Loaded config from local file');
      return config;
    }
  } catch (error) {
    console.error('⚠️  Error reading local config:', error.message);
  }
  return null;
}

function loadExampleConfig() {
  try {
    if (fs.existsSync(CONFIG_EXAMPLE_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_EXAMPLE_PATH, 'utf8'));
      console.log('ℹ️  Using template config from config.example');
      return config;
    }
  } catch (error) {
    console.error('⚠️  Error reading example config:', error.message);
  }
  return null;
}

function fetchConfigFromGitHub() {
  return new Promise((resolve, reject) => {
    https
      .get(GITHUB_PAGES_URL, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub Pages returned HTTP ${res.statusCode}`));
          res.resume();
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const config = JSON.parse(data);
            console.log('✅ Loaded config from GitHub Pages (secrets registry)');
            resolve(config);
          } catch (error) {
            reject(new Error('Invalid JSON from GitHub Pages: ' + error.message));
          }
        });
      })
      .on('error', reject);
  });
}

async function loadConfig() {
  // 1. Try local config first
  let config = loadLocalConfig();
  if (config) {
    return config;
  }

  // 2. Try GitHub Pages (deployed config with secrets)
  try {
    console.log('📡 Fetching config from GitHub Pages...');
    config = await fetchConfigFromGitHub();
    return config;
  } catch (error) {
    console.warn('⚠️  Could not fetch from GitHub Pages:', error.message);
  }

  // 3. Fall back to example config
  config = loadExampleConfig();
  if (config) {
    console.warn('⚠️  Using template config. Secrets will not work.');
    console.warn('   Set DISCORD_TOKEN and DISCORD_SERVER_ID locally, or wait for deployment.');
    return config;
  }

  // 4. No config available
  throw new Error(
    'No configuration found! Create config/config.json or set environment variables. ' +
    'See config.example/config.json for template.'
  );
}

module.exports = { loadConfig };
