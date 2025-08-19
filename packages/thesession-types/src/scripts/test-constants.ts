#!/usr/bin/env ts-node

/**
 * Test script for constants and error handling
 */

import {
  ErrorMessages,
  DataFiles,
  CONFIG,
  MonorepoError,
  DataFileError,
  DataParsingError,
} from '../constants';

console.log('🧪 Testing Constants and Error Handling');
console.log('=======================================\n');

console.log('📋 Error Messages:');
Object.entries(ErrorMessages).forEach(([key, message]) => {
  console.log(`  ${key}: "${message}"`);
});

console.log('\n📁 Data Files:');
Object.entries(DataFiles).forEach(([key, filename]) => {
  console.log(`  ${key}: "${filename}"`);
});

console.log('\n⚙️ Configuration:');
Object.entries(CONFIG).forEach(([key, value]) => {
  console.log(`  ${key}: "${value}"`);
});

console.log('\n🚨 Testing Error Classes:');

try {
  throw new MonorepoError();
} catch (error) {
  console.log(`✅ MonorepoError: ${error.name} - ${error.message}`);
}

try {
  throw new DataFileError('test.json');
} catch (error) {
  console.log(`✅ DataFileError: ${error.name} - ${error.message}`);
}

try {
  throw new DataParsingError('test.json', new Error('Original error'));
} catch (error) {
  if (error instanceof DataParsingError) {
    console.log(`✅ DataParsingError: ${error.name} - ${error.message}`);
    console.log(`   Original error: ${error.originalError?.message}`);
  }
}

console.log('\n✨ All constants and error classes working correctly!');
