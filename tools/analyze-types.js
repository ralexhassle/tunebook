#!/usr/bin/env node

/**
 * Analyze TheSession.org data to extract real entity types
 * This script analyzes the downloaded JSON files to extract all unique values
 * for key fields like tune types, modes, meters, etc.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Load JSON data from file
 */
function loadJsonData(fileName) {
  const filePath = path.join(DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  console.log(`📖 Loading ${fileName}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`   Loaded ${data.length} items`);

  return data;
}

/**
 * Extract unique values from an array of objects for a specific field
 */
function extractUniqueValues(data, field) {
  const values = new Set();

  data.forEach(item => {
    if (item[field] && item[field].trim()) {
      values.add(item[field].trim());
    }
  });

  return Array.from(values).sort();
}

/**
 * Extract unique values with counts
 */
function extractValueCounts(data, field) {
  const counts = new Map();

  data.forEach(item => {
    if (item[field] && item[field].trim()) {
      const value = item[field].trim();
      counts.set(value, (counts.get(value) || 0) + 1);
    }
  });

  // Convert to array and sort by count (descending)
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate TypeScript enum from values
 */
function generateEnum(enumName, values, useUpperCase = true) {
  const enumEntries = values.map(value => {
    // Create enum key (uppercase, replace spaces/special chars with underscores)
    let key = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    // Handle special cases
    if (key === '') key = 'UNKNOWN';
    if (/^\d/.test(key)) key = `TYPE_${key}`;

    return `  ${key} = '${value}'`;
  });

  return `export enum ${enumName} {\n${enumEntries.join(',\n')}\n}`;
}

/**
 * Analyze tune data
 */
function analyzeTunes() {
  console.log('\n🎵 Analyzing TUNES data...');
  console.log('='.repeat(40));

  const tunes = loadJsonData('tunes.json');

  // Extract tune types
  const tuneTypes = extractValueCounts(tunes, 'type');
  console.log(`\n📊 Found ${tuneTypes.length} unique tune types:`);
  tuneTypes.forEach(({ value, count }) => {
    console.log(`   ${value.padEnd(20)} (${count.toLocaleString()} tunes)`);
  });

  // Extract meters
  const meters = extractValueCounts(tunes, 'meter');
  console.log(`\n🎼 Found ${meters.length} unique meters:`);
  meters.forEach(({ value, count }) => {
    console.log(`   ${value.padEnd(10)} (${count.toLocaleString()} tunes)`);
  });

  // Extract modes
  const modes = extractValueCounts(tunes, 'mode');
  console.log(`\n🎹 Found ${modes.length} unique modes:`);
  modes.slice(0, 20).forEach(({ value, count }) => {
    console.log(`   ${value.padEnd(15)} (${count.toLocaleString()} tunes)`);
  });

  if (modes.length > 20) {
    console.log(`   ... and ${modes.length - 20} more modes`);
  }

  return {
    tuneTypes: tuneTypes.map(t => t.value),
    meters: meters.map(m => m.value),
    modes: modes.map(m => m.value),
  };
}

/**
 * Analyze recording data
 */
function analyzeRecordings() {
  console.log('\n💿 Analyzing RECORDINGS data...');
  console.log('='.repeat(40));

  const recordings = loadJsonData('recordings.json');

  // Get unique artists (top 20)
  const artists = extractValueCounts(recordings, 'artist');
  console.log(`\n🎤 Found ${artists.length} unique artists (top 20):`);
  artists.slice(0, 20).forEach(({ value, count }) => {
    console.log(`   ${value.padEnd(30)} (${count} recordings)`);
  });

  // Analyze track numbers
  const trackNumbers = extractUniqueValues(recordings, 'track');
  console.log(
    `\n📀 Track numbers range: ${trackNumbers[0]} to ${trackNumbers[trackNumbers.length - 1]}`
  );

  return {
    totalArtists: artists.length,
    totalRecordings: recordings.length,
    maxTrackNumber: Math.max(
      ...trackNumbers.map(Number).filter(n => !isNaN(n))
    ),
  };
}

/**
 * Generate TypeScript enums file
 */
function generateEnumsFile(analysis) {
  const { tuneTypes, meters, modes } = analysis;

  let content = `/**
 * Generated TypeScript enums from TheSession.org data analysis
 * Generated on: ${new Date().toISOString()}
 */

`;

  // Generate TuneType enum
  content += generateEnum('TuneType', tuneTypes) + '\n\n';

  // Generate Meter enum
  content += generateEnum('Meter', meters) + '\n\n';

  // Generate Mode enum (top 50 most common to keep it manageable)
  const topModes = modes.slice(0, 50);
  content += generateEnum('MusicalMode', topModes) + '\n\n';

  // Add some utility types
  content += `/**
 * Utility type for all tune type values
 */
export type TuneTypeValue = \`\${TuneType}\`;

/**
 * Utility type for all meter values
 */
export type MeterValue = \`\${Meter}\`;

/**
 * Utility type for all mode values
 */
export type MusicalModeValue = \`\${MusicalMode}\`;

/**
 * Statistics about the data
 */
export const DATA_STATS = {
  totalTuneTypes: ${tuneTypes.length},
  totalMeters: ${meters.length},
  totalModes: ${modes.length},
  topModesIncluded: ${topModes.length}
} as const;
`;

  return content;
}

/**
 * Main analysis function
 */
async function analyzeTypes() {
  console.log('🔍 TheSession.org Type Analysis');
  console.log('='.repeat(50));

  try {
    // Check if data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      console.error(`❌ Data directory not found: ${DATA_DIR}`);
      console.log(
        '💡 Run "node tools/download-data.js" first to download the data files'
      );
      process.exit(1);
    }

    // Analyze different data types
    const tuneAnalysis = analyzeTunes();
    const recordingAnalysis = analyzeRecordings();

    // Generate TypeScript enums
    console.log('\n📝 Generating TypeScript enums...');
    const enumsContent = generateEnumsFile(tuneAnalysis);

    // Save to file
    const outputPath = path.join(
      __dirname,
      '..',
      'packages',
      'shared-types',
      'src',
      'enums.ts'
    );
    fs.writeFileSync(outputPath, enumsContent);
    console.log(`✅ Enums saved to: ${outputPath}`);

    // Save analysis results
    const analysisPath = path.join(
      __dirname,
      '..',
      'docs',
      'type-analysis.json'
    );
    const analysisData = {
      timestamp: new Date().toISOString(),
      tuneAnalysis,
      recordingAnalysis,
      summary: {
        totalTuneTypes: tuneAnalysis.tuneTypes.length,
        totalMeters: tuneAnalysis.meters.length,
        totalModes: tuneAnalysis.modes.length,
        totalArtists: recordingAnalysis.totalArtists,
        totalRecordings: recordingAnalysis.totalRecordings,
      },
    };

    fs.writeFileSync(analysisPath, JSON.stringify(analysisData, null, 2));
    console.log(`📊 Analysis results saved to: ${analysisPath}`);

    console.log('\n🎉 Type analysis complete!');
    console.log('\n📋 Summary:');
    console.log(`   - ${tuneAnalysis.tuneTypes.length} tune types`);
    console.log(`   - ${tuneAnalysis.meters.length} meters`);
    console.log(`   - ${tuneAnalysis.modes.length} modes (top 50 in enum)`);
    console.log(
      `   - ${recordingAnalysis.totalArtists.toLocaleString()} artists`
    );
    console.log(
      `   - ${recordingAnalysis.totalRecordings.toLocaleString()} recordings`
    );
  } catch (error) {
    console.error('💥 Analysis failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  analyzeTypes();
}

module.exports = { analyzeTypes };
