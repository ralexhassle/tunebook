#!/usr/bin/env ts-node

/**
 * Script to test and debug path resolution
 */

import { getMonorepoRoot, getDataDir } from '../utils/data-reader';

console.log('🔍 Path Resolution Debug');
console.log('========================\n');

console.log('Current working directory:', process.cwd());
console.log('Script __dirname:', __dirname);
console.log('Detected monorepo root:', getMonorepoRoot());
console.log('Data directory:', getDataDir());

console.log('\n📁 Checking paths:');
import { existsSync } from 'fs';

const monorepoRoot = getMonorepoRoot();
const dataDir = getDataDir();

console.log('✅ Monorepo root exists:', existsSync(monorepoRoot));
console.log(
  '✅ pnpm-workspace.yaml exists:',
  existsSync(`${monorepoRoot}/pnpm-workspace.yaml`)
);
console.log('✅ Data directory exists:', existsSync(dataDir));
console.log('✅ tunes.json exists:', existsSync(`${dataDir}/tunes.json`));

// List data files
import { readdirSync } from 'fs';
try {
  const dataFiles = readdirSync(dataDir);
  console.log('\n📄 Data files found:');
  dataFiles.forEach((file) => console.log(`  - ${file}`));
} catch (error) {
  console.error('❌ Error reading data directory:', error);
}
