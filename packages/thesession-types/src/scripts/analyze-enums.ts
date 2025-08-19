#!/usr/bin/env ts-node

/**
 * Script to analyze unique types and modes from the data
 */

import { readTunesData } from '../utils/data-reader';

function analyzeUniqueValues() {
  console.log('🔍 Analyzing unique tune types and modes from data');
  console.log('==================================================\n');

  try {
    const tunes = readTunesData();

    // Analyze types
    const types = new Set<string>();
    const modes = new Set<string>();
    const meters = new Set<string>();

    tunes.forEach((tune) => {
      if (tune.type) types.add(tune.type.trim());
      if (tune.mode) modes.add(tune.mode.trim());
      if (tune.meter) meters.add(tune.meter.trim());
    });

    console.log(`📊 Found ${types.size} unique tune types:`);
    const sortedTypes = Array.from(types).sort();
    sortedTypes.forEach((type, index) => {
      console.log(`${(index + 1).toString().padStart(2)}: "${type}"`);
    });

    console.log(`\n🎵 Found ${modes.size} unique modes:`);
    const sortedModes = Array.from(modes).sort();
    sortedModes.forEach((mode, index) => {
      console.log(`${(index + 1).toString().padStart(2)}: "${mode}"`);
    });

    console.log(`\n🎼 Found ${meters.size} unique meters:`);
    const sortedMeters = Array.from(meters).sort();
    sortedMeters.forEach((meter, index) => {
      console.log(`${(index + 1).toString().padStart(2)}: "${meter}"`);
    });

    // Generate enum code
    console.log('\n📝 Generated TypeScript enums:');
    console.log('\n// Tune Types Enum');
    console.log('export enum TuneType {');
    sortedTypes.forEach((type) => {
      const enumKey = type
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      console.log(`  ${enumKey} = '${type}',`);
    });
    console.log('}\n');

    console.log('// Tune Modes Enum');
    console.log('export enum TuneMode {');
    sortedModes.forEach((mode) => {
      const enumKey = mode
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      console.log(`  ${enumKey} = '${mode}',`);
    });
    console.log('}\n');

    console.log('// Time Signatures Enum');
    console.log('export enum TimeSignature {');
    sortedMeters.forEach((meter) => {
      const enumKey = meter.replace(/[^A-Z0-9]/g, '_').toUpperCase();
      console.log(`  TIME_${enumKey} = '${meter}',`);
    });
    console.log('}');
  } catch (error) {
    console.error('❌ Error analyzing data:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  analyzeUniqueValues();
}

export { analyzeUniqueValues };
