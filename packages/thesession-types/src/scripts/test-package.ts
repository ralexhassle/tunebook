#!/usr/bin/env ts-node

/**
 * Comprehensive test of the thesession-types package
 */

import {
  // Types
  TuneData,
  RecordingData,
  AliasData,
  // Enums
  TuneType,
  TuneMode,
  TimeSignature,
  isValidTuneType,
  isValidTuneMode,
  isValidTimeSignature,
  getAllTuneTypes,
  getAllTuneModes,
  getAllTimeSignatures,
  // Constants
  ErrorMessages,
  DataFiles,
  CONFIG,
  // Data utilities
  readTunesData,
  // Search engine
  TuneSearchEngine,
  SearchFilters,
  SearchResult,
} from '../index';

function runTests() {
  console.log('🧪 Testing @tunebook/thesession-types Package');
  console.log('==============================================\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Enum validation
  console.log('1. Testing enum validation...');
  try {
    const validType = isValidTuneType('reel');
    const invalidType = isValidTuneType('invalid');
    const validMode = isValidTuneMode('Gmajor');
    const invalidMode = isValidTuneMode('Xinvalid');

    if (validType && !invalidType && validMode && !invalidMode) {
      console.log('   ✅ Enum validation works correctly');
      testsPassed++;
    } else {
      console.log('   ❌ Enum validation failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Enum validation threw error:', error);
    testsFailed++;
  }

  // Test 2: Data reading
  console.log('2. Testing data reading...');
  try {
    const tunes = readTunesData();
    if (tunes.length > 50000) {
      console.log(
        `   ✅ Successfully read ${tunes.length.toLocaleString()} tunes`
      );
      testsPassed++;
    } else {
      console.log(`   ❌ Expected more than 50k tunes, got ${tunes.length}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Data reading failed:', error);
    testsFailed++;
  }

  // Test 3: Search engine
  console.log('3. Testing search engine...');
  try {
    const searchEngine = new TuneSearchEngine();

    // Search for reels
    const reelSearch = searchEngine.search({ type: TuneType.REEL }, 10);

    if (reelSearch.tunes.length === 10 && reelSearch.totalCount > 1000) {
      console.log(
        `   ✅ Search found ${reelSearch.totalCount.toLocaleString()} reels (returned 10)`
      );
      testsPassed++;
    } else {
      console.log(
        `   ❌ Search returned unexpected results: ${reelSearch.tunes.length} tunes, ${reelSearch.totalCount} total`
      );
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Search engine failed:', error);
    testsFailed++;
  }

  // Test 4: Type safety
  console.log('4. Testing type safety...');
  try {
    const searchFilters: SearchFilters = {
      type: TuneType.JIG,
      mode: TuneMode.DMAJOR,
      meter: TimeSignature.TIME_6_8,
    };

    if (
      searchFilters.type === 'jig' &&
      searchFilters.mode === 'Dmajor' &&
      searchFilters.meter === '6/8'
    ) {
      console.log(
        '   ✅ Type safety working - enums compile to correct string values'
      );
      testsPassed++;
    } else {
      console.log('   ❌ Type safety failed - enum values incorrect');
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Type safety test failed:', error);
    testsFailed++;
  }

  // Test 5: Constants and error handling
  console.log('5. Testing constants and error handling...');
  try {
    const tunesFile = DataFiles.TUNES;
    const errorMsg = ErrorMessages.MONOREPO_ROOT_NOT_FOUND;

    if (tunesFile === 'tunes.json' && typeof errorMsg === 'string') {
      console.log('   ✅ Constants working correctly');
      testsPassed++;
    } else {
      console.log('   ❌ Constants failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Constants test failed:', error);
    testsFailed++;
  }

  // Test 6: Enum completeness
  console.log('6. Testing enum completeness...');
  try {
    const allTypes = getAllTuneTypes();
    const allModes = getAllTuneModes();
    const allMeters = getAllTimeSignatures();

    if (
      allTypes.length === 12 &&
      allModes.length === 23 &&
      allMeters.length === 7
    ) {
      console.log(
        `   ✅ Enums complete: ${allTypes.length} types, ${allModes.length} modes, ${allMeters.length} meters`
      );
      testsPassed++;
    } else {
      console.log(
        `   ❌ Enum counts unexpected: ${allTypes.length} types, ${allModes.length} modes, ${allMeters.length} meters`
      );
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Enum completeness test failed:', error);
    testsFailed++;
  }

  // Test 7: Real data search
  console.log('7. Testing real data search...');
  try {
    const searchEngine = new TuneSearchEngine();
    const irishSearch = searchEngine.search(
      {
        name: 'Irish',
        type: TuneType.REEL,
      },
      5
    );

    if (irishSearch.tunes.length > 0 && irishSearch.totalCount > 0) {
      console.log(`   ✅ Found ${irishSearch.totalCount} Irish reels`);
      console.log(
        `      Example: "${irishSearch.tunes[0].name}" by ${irishSearch.tunes[0].username}`
      );
      testsPassed++;
    } else {
      console.log('   ❌ No Irish reels found (unexpected)');
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Real data search failed:', error);
    testsFailed++;
  }

  // Summary
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log(
    `   📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`
  );

  if (testsFailed === 0) {
    console.log(
      '\n🎉 All tests passed! The thesession-types package is working correctly.'
    );
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }

  return testsFailed === 0;
}

// Execute if run directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

export { runTests };
