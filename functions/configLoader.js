/**
 * Config loader
 * 1. Starts from config.example defaults
 * 2. Applies local config/config.json if present
 * 3. Applies environment overrides
 */

const fs = require('fs');
const path = require('path');

const CONFIG_LOCAL_PATH = path.join(__dirname, '../config/config.json');
const CONFIG_EXAMPLE_PATH = path.join(__dirname, '../config.example/config.json');

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

function parseGuildIds(raw) {
  if (typeof raw !== 'string') {
    return undefined;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error('DISCORD_SERVER_ID must be a JSON array or a comma-separated list.');
    }

    return parsed.map(String).map((id) => id.trim()).filter(Boolean);
  }

  return trimmed.split(',').map((id) => id.trim()).filter(Boolean);
}

function applyEnvironmentOverrides(config) {
  const nextConfig = { ...config };

  const token = process.env.DISCORD_TOKEN || process.env.CHECKLIST_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN || process.env.TOKEN;
  if (typeof token === 'string' && token.trim()) {
    nextConfig.token = token.trim();
  }

  const slashGuildIdsRaw = process.env.DISCORD_SERVER_ID || process.env.CHECKLIST_SLASH_GUILD_IDS || process.env.SLASH_GUILD_IDS;
  if (typeof slashGuildIdsRaw === 'string') {
    nextConfig.slashGuildIDs = parseGuildIds(slashGuildIdsRaw);
  }

  const checklistCommand = process.env.CHECKLIST_COMMAND;
  if (typeof checklistCommand === 'string' && checklistCommand.trim()) {
    nextConfig.checklistCommand = checklistCommand.trim();
  }

  return nextConfig;
}

function normalizeConfig(config) {
  const normalized = { ...config };
  normalized.token = typeof normalized.token === 'string' ? normalized.token.trim() : '';
  normalized.slashGuildIDs = Array.isArray(normalized.slashGuildIDs)
    ? normalized.slashGuildIDs.map(String).map((id) => id.trim()).filter(Boolean)
    : [];
  normalized.checklistCommand = typeof normalized.checklistCommand === 'string' && normalized.checklistCommand.trim()
    ? normalized.checklistCommand.trim()
    : 'checklist';
  return normalized;
}

async function loadConfig() {
  const exampleConfig = loadExampleConfig() || {};
  const localConfig = loadLocalConfig() || {};
  const config = normalizeConfig(applyEnvironmentOverrides({ ...exampleConfig, ...localConfig }));

  if (!config.token) {
    throw new Error('No Discord token configured. Set DISCORD_TOKEN or create config/config.json.');
  }

  if (!config.slashGuildIDs.length) {
    throw new Error('No slash guild IDs configured. Set DISCORD_SERVER_ID or add slashGuildIDs to config/config.json.');
  }

  return config;
}

module.exports = { loadConfig };
