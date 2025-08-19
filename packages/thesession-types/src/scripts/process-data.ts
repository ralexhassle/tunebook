#!/usr/bin/env ts-node

/**
 * Data processing script for analyzing thesession.org Irish music data
 *
 * Usage:
 *   pnpm dev                    # Run once
 *   pnpm dev:watch             # Run with file watching
 *   pnpm execute src/scripts/process-data.ts  # Direct execution
 */

import {
  readTunesData,
  readRecordingsData,
  readAliasesData,
  readTunePopularityData,
  readTuneSetsData,
  getDataStats,
} from '../utils/data-reader';

async function main() {
  console.log('🎵 Irish Music Data Analysis');
  console.log('============================\n');

  // Get overview of all data files
  const files = [
    'tunes.json',
    'recordings.json',
    'aliases.json',
    'tune_popularity.json',
    'sets.json',
  ];

  console.log('📊 Data Overview:');
  files.forEach((filename) => {
    const stats = getDataStats(filename);
    if ('error' in stats) {
      console.log(`❌ ${filename}: Error - ${stats.error}`);
    } else {
      console.log(`✅ ${filename}: ${stats.count.toLocaleString()} records`);
      console.log(`   Keys: ${stats.keys.join(', ')}\n`);
    }
  });

  // Example analysis: Most popular tune types
  console.log('🎼 Analyzing tune types...');
  try {
    const tunes = readTunesData();
    const typeCount = new Map<string, number>();

    tunes.forEach((tune) => {
      const type = tune.type || 'unknown';
      typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    const sortedTypes = Array.from(typeCount.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    console.log('\nTop 10 tune types:');
    sortedTypes.forEach(([type, count], index) => {
      console.log(`${index + 1}. ${type}: ${count.toLocaleString()}`);
    });
  } catch (error) {
    console.error('Error analyzing tune types:', error);
  }

  // Example analysis: Modes distribution
  console.log('\n🎵 Analyzing modes...');
  try {
    const tunes = readTunesData();
    const modeCount = new Map<string, number>();

    tunes.forEach((tune) => {
      const mode = tune.mode || 'unknown';
      modeCount.set(mode, (modeCount.get(mode) || 0) + 1);
    });

    const sortedModes = Array.from(modeCount.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    console.log('\nTop 10 modes:');
    sortedModes.forEach(([mode, count], index) => {
      console.log(`${index + 1}. ${mode}: ${count.toLocaleString()}`);
    });
  } catch (error) {
    console.error('Error analyzing modes:', error);
  }

  console.log('\n✨ Analysis complete!');
  console.log('\n💡 You can now add your own analysis code in this file.');
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

export { main };
