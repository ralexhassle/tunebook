#!/usr/bin/env ts-node

/**
 * Statistics script using the new enums
 */

import { readTunesData } from '../utils/data-reader';
import {
  TuneType,
  TuneMode,
  TimeSignature,
  isValidTuneType,
  isValidTuneMode,
  isValidTimeSignature,
} from '../enums';

function generateStatistics() {
  console.log('📊 Irish Traditional Music Statistics');
  console.log('=====================================\n');

  try {
    const tunes = readTunesData();
    console.log(`📈 Total tunes analyzed: ${tunes.length.toLocaleString()}\n`);

    // Type statistics
    const typeStats = new Map<TuneType, number>();
    const modeStats = new Map<TuneMode, number>();
    const meterStats = new Map<TimeSignature, number>();

    let validTypes = 0;
    let validModes = 0;
    let validMeters = 0;

    tunes.forEach((tune) => {
      // Type statistics
      if (tune.type && isValidTuneType(tune.type)) {
        typeStats.set(
          tune.type as TuneType,
          (typeStats.get(tune.type as TuneType) || 0) + 1
        );
        validTypes++;
      }

      // Mode statistics
      if (tune.mode && isValidTuneMode(tune.mode)) {
        modeStats.set(
          tune.mode as TuneMode,
          (modeStats.get(tune.mode as TuneMode) || 0) + 1
        );
        validModes++;
      }

      // Meter statistics
      if (tune.meter && isValidTimeSignature(tune.meter)) {
        meterStats.set(
          tune.meter as TimeSignature,
          (meterStats.get(tune.meter as TimeSignature) || 0) + 1
        );
        validMeters++;
      }
    });

    // Display type statistics
    console.log('🎼 Tune Type Distribution:');
    console.log(`   (${validTypes}/${tunes.length} tunes have valid types)\n`);

    const sortedTypes = Array.from(typeStats.entries()).sort(
      ([, a], [, b]) => b - a
    );

    sortedTypes.forEach(([type, count], index) => {
      const percentage = ((count / validTypes) * 100).toFixed(1);
      console.log(
        `${(index + 1).toString().padStart(2)}. ${type.padEnd(12)} ${count.toLocaleString().padStart(7)} (${percentage}%)`
      );
    });

    // Display mode statistics
    console.log('\n🎵 Musical Mode Distribution:');
    console.log(`   (${validModes}/${tunes.length} tunes have valid modes)\n`);

    const sortedModes = Array.from(modeStats.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Top 10

    sortedModes.forEach(([mode, count], index) => {
      const percentage = ((count / validModes) * 100).toFixed(1);
      console.log(
        `${(index + 1).toString().padStart(2)}. ${mode.padEnd(12)} ${count.toLocaleString().padStart(7)} (${percentage}%)`
      );
    });

    // Display meter statistics
    console.log('\n🥁 Time Signature Distribution:');
    console.log(
      `   (${validMeters}/${tunes.length} tunes have valid meters)\n`
    );

    const sortedMeters = Array.from(meterStats.entries()).sort(
      ([, a], [, b]) => b - a
    );

    sortedMeters.forEach(([meter, count], index) => {
      const percentage = ((count / validMeters) * 100).toFixed(1);
      console.log(
        `${(index + 1).toString().padStart(2)}. ${meter.padEnd(8)} ${count.toLocaleString().padStart(7)} (${percentage}%)`
      );
    });

    // Summary
    console.log('\n📋 Summary:');
    console.log(`   • ${Object.keys(TuneType).length} distinct tune types`);
    console.log(`   • ${Object.keys(TuneMode).length} distinct musical modes`);
    console.log(
      `   • ${Object.keys(TimeSignature).length} distinct time signatures`
    );
    console.log(
      `   • Data completeness: Types ${((validTypes / tunes.length) * 100).toFixed(1)}%, Modes ${((validModes / tunes.length) * 100).toFixed(1)}%, Meters ${((validMeters / tunes.length) * 100).toFixed(1)}%`
    );
  } catch (error) {
    console.error('❌ Error generating statistics:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  generateStatistics();
}

export { generateStatistics };
