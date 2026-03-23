const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publishDir = path.join(rootDir, '.deploy');

const entriesToCopy = [
  'README.md',
  'checklist.js',
  'package.json',
  'package-lock.json',
  'commands',
  'functions',
  'config'
];

function copyEntry(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(publishDir, relativePath);

  if (!fs.existsSync(sourcePath)) {
    return;
  }

  const stat = fs.statSync(sourcePath);
  if (stat.isDirectory()) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.cpSync(sourcePath, targetPath, { recursive: true });
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function main() {
  fs.rmSync(publishDir, { recursive: true, force: true });
  fs.mkdirSync(publishDir, { recursive: true });

  for (const entry of entriesToCopy) {
    copyEntry(entry);
  }

  console.log('Prepared GitHub Pages directory at:', publishDir);
}

try {
  main();
} catch (error) {
  console.error('Failed to prepare publish directory:', error.message);
  process.exit(1);
}
