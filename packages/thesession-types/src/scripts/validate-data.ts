#!/usr/bin/env ts-node

/**
 * Data validation script using the new enums
 */

import { readTunesData } from '../utils/data-reader';
import {
  TuneType,
  TuneMode,
  TimeSignature,
  isValidTuneType,
  isValidTuneMode,
  isValidTimeSignature,
  getAllTuneTypes,
  getAllTuneModes,
  getAllTimeSignatures,
} from '../enums';
import { DataFileError } from '../constants';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    total: number;
    validTypes: number;
    validModes: number;
    validMeters: number;
    invalidTypes: string[];
    invalidModes: string[];
    invalidMeters: string[];
  };
}

function validateTuneData(): ValidationResult {
  console.log('🔍 Validating Tune Data');
  console.log('========================\n');

  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      total: 0,
      validTypes: 0,
      validModes: 0,
      validMeters: 0,
      invalidTypes: [],
      invalidModes: [],
      invalidMeters: [],
    },
  };

  try {
    const tunes = readTunesData();
    result.stats.total = tunes.length;

    console.log(`📊 Analyzing ${tunes.length.toLocaleString()} tunes...\n`);

    const seenInvalidTypes = new Set<string>();
    const seenInvalidModes = new Set<string>();
    const seenInvalidMeters = new Set<string>();

    tunes.forEach((tune, index) => {
      // Validate type
      if (tune.type) {
        if (isValidTuneType(tune.type)) {
          result.stats.validTypes++;
        } else {
          if (!seenInvalidTypes.has(tune.type)) {
            seenInvalidTypes.add(tune.type);
            result.stats.invalidTypes.push(tune.type);
            result.warnings.push(
              `Invalid tune type found: "${tune.type}" (first seen in tune ID: ${tune.tune_id})`
            );
          }
        }
      } else {
        result.warnings.push(`Tune ID ${tune.tune_id} has no type specified`);
      }

      // Validate mode
      if (tune.mode) {
        if (isValidTuneMode(tune.mode)) {
          result.stats.validModes++;
        } else {
          if (!seenInvalidModes.has(tune.mode)) {
            seenInvalidModes.add(tune.mode);
            result.stats.invalidModes.push(tune.mode);
            result.warnings.push(
              `Invalid tune mode found: "${tune.mode}" (first seen in tune ID: ${tune.tune_id})`
            );
          }
        }
      } else {
        result.warnings.push(`Tune ID ${tune.tune_id} has no mode specified`);
      }

      // Validate meter
      if (tune.meter) {
        if (isValidTimeSignature(tune.meter)) {
          result.stats.validMeters++;
        } else {
          if (!seenInvalidMeters.has(tune.meter)) {
            seenInvalidMeters.add(tune.meter);
            result.stats.invalidMeters.push(tune.meter);
            result.warnings.push(
              `Invalid time signature found: "${tune.meter}" (first seen in tune ID: ${tune.tune_id})`
            );
          }
        }
      } else {
        result.warnings.push(`Tune ID ${tune.tune_id} has no meter specified`);
      }

      // Check for required fields
      if (!tune.tune_id) {
        result.errors.push(`Tune at index ${index} has no tune_id`);
        result.isValid = false;
      }
      if (!tune.name) {
        result.warnings.push(`Tune ID ${tune.tune_id} has no name`);
      }
    });

    // Display validation results
    console.log('✅ Validation Results:');
    console.log(`   • Total tunes: ${result.stats.total.toLocaleString()}`);
    console.log(
      `   • Valid types: ${result.stats.validTypes.toLocaleString()} (${((result.stats.validTypes / result.stats.total) * 100).toFixed(1)}%)`
    );
    console.log(
      `   • Valid modes: ${result.stats.validModes.toLocaleString()} (${((result.stats.validModes / result.stats.total) * 100).toFixed(1)}%)`
    );
    console.log(
      `   • Valid meters: ${result.stats.validMeters.toLocaleString()} (${((result.stats.validMeters / result.stats.total) * 100).toFixed(1)}%)`
    );

    if (result.stats.invalidTypes.length > 0) {
      console.log(
        `\n⚠️  Invalid Types Found (${result.stats.invalidTypes.length}):`
      );
      result.stats.invalidTypes.forEach((type) =>
        console.log(`   • "${type}"`)
      );
    }

    if (result.stats.invalidModes.length > 0) {
      console.log(
        `\n⚠️  Invalid Modes Found (${result.stats.invalidModes.length}):`
      );
      result.stats.invalidModes.forEach((mode) =>
        console.log(`   • "${mode}"`)
      );
    }

    if (result.stats.invalidMeters.length > 0) {
      console.log(
        `\n⚠️  Invalid Meters Found (${result.stats.invalidMeters.length}):`
      );
      result.stats.invalidMeters.forEach((meter) =>
        console.log(`   • "${meter}"`)
      );
    }

    // Display enum coverage
    console.log('\n📋 Enum Coverage:');
    console.log(`   • TuneType enum covers: ${getAllTuneTypes().length} types`);
    console.log(`   • TuneMode enum covers: ${getAllTuneModes().length} modes`);
    console.log(
      `   • TimeSignature enum covers: ${getAllTimeSignatures().length} signatures`
    );

    // Summary
    if (
      result.errors.length === 0 &&
      result.stats.invalidTypes.length === 0 &&
      result.stats.invalidModes.length === 0 &&
      result.stats.invalidMeters.length === 0
    ) {
      console.log(
        '\n🎉 All data is valid! Our enums perfectly cover the dataset.'
      );
    } else {
      console.log(`\n📊 Validation Summary:`);
      console.log(`   • Errors: ${result.errors.length}`);
      console.log(`   • Warnings: ${result.warnings.length}`);
      console.log(
        `   • Data Coverage: ${result.stats.invalidTypes.length === 0 && result.stats.invalidModes.length === 0 && result.stats.invalidMeters.length === 0 ? 'Complete' : 'Incomplete'}`
      );
    }
  } catch (error) {
    result.errors.push(`Failed to read tune data: ${error}`);
    result.isValid = false;
    console.error('❌ Validation failed:', error);
  }

  return result;
}

// Execute if run directly
if (require.main === module) {
  const result = validateTuneData();
  process.exit(
    result.isValid &&
      result.stats.invalidTypes.length === 0 &&
      result.stats.invalidModes.length === 0 &&
      result.stats.invalidMeters.length === 0
      ? 0
      : 1
  );
}

export { validateTuneData, ValidationResult };
