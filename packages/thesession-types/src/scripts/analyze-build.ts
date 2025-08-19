#!/usr/bin/env ts-node

/**
 * Build analysis script - shows what gets built and where
 */

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  try {
    const files = readdirSync(dirPath);

    for (const file of files) {
      const filePath = join(dirPath, file);
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return totalSize;
}

function analyzeBuild() {
  console.log('🔍 Build Analysis');
  console.log('=================\n');

  // Find all dist directories
  try {
    const distDirs = execSync(
      'find . -name "dist" -type d -not -path "./node_modules/*"',
      { encoding: 'utf8' }
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    if (distDirs.length === 0) {
      console.log('❌ No dist directories found. Run `pnpm build` first.');
      return;
    }

    console.log('📦 Built packages:');
    let totalSize = 0;

    distDirs.forEach((distDir) => {
      const size = getDirectorySize(distDir);
      totalSize += size;

      console.log(`\n📁 ${distDir}`);
      console.log(`   Size: ${formatBytes(size)}`);

      try {
        const files = readdirSync(distDir);
        const jsFiles = files.filter((f) => f.endsWith('.js'));
        const dtsFiles = files.filter((f) => f.endsWith('.d.ts'));
        const subdirs = files.filter((f) => {
          try {
            return statSync(join(distDir, f)).isDirectory();
          } catch {
            return false;
          }
        });

        console.log(`   Files: ${files.length} total`);
        console.log(`   - ${jsFiles.length} JavaScript files`);
        console.log(`   - ${dtsFiles.length} TypeScript declaration files`);
        if (subdirs.length > 0) {
          console.log(
            `   - ${subdirs.length} subdirectories: ${subdirs.join(', ')}`
          );
        }
      } catch (error) {
        console.log(`   ❌ Error reading directory: ${error}`);
      }
    });

    console.log(`\n📊 Total build size: ${formatBytes(totalSize)}`);
    console.log(`📈 Number of packages built: ${distDirs.length}`);
  } catch (error) {
    console.error('❌ Error analyzing build:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  analyzeBuild();
}

export { analyzeBuild };
