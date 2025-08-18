#!/usr/bin/env node

/**
 * Main data processing script
 * Downloads TheSession.org data and analyzes it to generate TypeScript types
 */

const { downloadData } = require('./download-data');
const { analyzeTypes } = require('./analyze-types');

async function processData() {
  console.log('🎵 TheSession.org Data Processing Pipeline');
  console.log('='.repeat(50));

  try {
    // Step 1: Download data
    console.log('📥 Step 1: Downloading data files...');
    await downloadData();

    console.log('\n⏳ Waiting 2 seconds before analysis...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Analyze types
    console.log('\n🔍 Step 2: Analyzing types...');
    await analyzeTypes();

    console.log('\n🎉 Data processing pipeline complete!');
    console.log('\n📋 Next steps:');
    console.log(
      '1. Review generated enums in packages/shared-types/src/enums.ts'
    );
    console.log('2. Update the main types file to use the new enums');
    console.log('3. Rebuild the shared-types package');
  } catch (error) {
    console.error('💥 Data processing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  processData();
}

module.exports = { processData };
