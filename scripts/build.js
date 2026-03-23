const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const configExampleDir = path.join(rootDir, 'config.example');
const configDir = path.join(rootDir, 'config');
const configPath = path.join(configDir, 'config.json');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 3) + '\n', 'utf8');
}

function parseGuildIds(raw) {
  if (!raw) {
    return undefined;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        throw new Error('not an array');
      }
      return parsed.map(String).map((id) => id.trim()).filter(Boolean);
    } catch (error) {
      throw new Error('DISCORD_SERVER_ID must be a JSON array or a comma-separated list.');
    }
  }

  return trimmed
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

function main() {
  // For local development: copy template without secrets
  // GitHub Actions: use scripts/generate-config.js instead for secret injection
  
  ensureDir(configDir);
  
  // Only copy if config doesn't exist (to preserve manual changes)
  if (!fs.existsSync(configPath)) {
    fs.cpSync(configExampleDir, configDir, { recursive: true });
    console.log('✅ Config template copied from config.example to config/');
    console.log('   For secrets: Define DISCORD_TOKEN and DISCORD_SERVER_ID locally,');
    console.log('   or they will be fetched from GitHub Pages at runtime.');
  } else {
    console.log('ℹ️  Config already exists at:', configPath);
    console.log('   Skipping template copy.');
  }
  
  // Apply environment secrets if available (optional for local dev)
  if (fs.existsSync(configPath)) {
    const config = readJson(configPath);
    let modified = false;

    const token = process.env.DISCORD_TOKEN || process.env.CHECKLIST_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN || process.env.TOKEN;
    if (typeof token === 'string') {
      config.token = token;
      modified = true;
    }

    const slashGuildIdsRaw = process.env.DISCORD_SERVER_ID || process.env.CHECKLIST_SLASH_GUILD_IDS || process.env.SLASH_GUILD_IDS;
    if (typeof slashGuildIdsRaw === 'string') {
      config.slashGuildIDs = parseGuildIds(slashGuildIdsRaw);
      modified = true;
    }

    const checklistCommand = process.env.CHECKLIST_COMMAND;
    if (typeof checklistCommand === 'string' && checklistCommand.trim()) {
      config.checklistCommand = checklistCommand.trim();
      modified = true;
    }

    if (modified) {
      writeJson(configPath, config);
      console.log('✅ Config updated with environment variables');
    }
  }
}

try {
  main();
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
