/**
 * Generate configuration from environment secrets (GitHub Actions only)
 * This script should be run during CI/CD before deployment
 * Local development should skip this and use the config loader at runtime
 */

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
  // Verify running in CI/CD context
  if (!process.env.CI && !process.env.GITHUB_ACTIONS) {
    console.warn('⚠️  Warning: This script is designed for GitHub Actions CI/CD.');
    console.warn('    For local development, config will be fetched at runtime.');
    process.exit(0);
  }

  // Check required secrets
  const token = process.env.DISCORD_TOKEN || process.env.CHECKLIST_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN || process.env.TOKEN;
  const slashGuildIdsRaw = process.env.DISCORD_SERVER_ID || process.env.CHECKLIST_SLASH_GUILD_IDS || process.env.SLASH_GUILD_IDS;

  if (!token) {
    console.error('❌ Error: DISCORD_TOKEN secret not found. Set it in GitHub repository secrets.');
    process.exit(1);
  }

  if (!slashGuildIdsRaw) {
    console.error('❌ Error: DISCORD_SERVER_ID variable not found. Set it in GitHub repository variables.');
    process.exit(1);
  }

  // Prepare config
  fs.rmSync(configDir, { recursive: true, force: true });
  ensureDir(configDir);
  fs.cpSync(configExampleDir, configDir, { recursive: true });

  const templateConfigPath = path.join(configExampleDir, 'config.json');
  const config = readJson(templateConfigPath);

  config.token = token;
  config.slashGuildIDs = parseGuildIds(slashGuildIdsRaw);

  const checklistCommand = process.env.CHECKLIST_COMMAND;
  if (typeof checklistCommand === 'string' && checklistCommand.trim()) {
    config.checklistCommand = checklistCommand.trim();
  }

  writeJson(configPath, config);

  console.log('✅ Config generated successfully at:', configPath);
  console.log('   Token:', token.substring(0, 10) + '...');
  console.log('   Guild IDs:', config.slashGuildIDs.join(', '));
}

try {
  main();
} catch (error) {
  console.error('❌ Config generation failed:', error.message);
  process.exit(1);
}
