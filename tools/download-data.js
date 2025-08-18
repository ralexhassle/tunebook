#!/usr/bin/env node

/**
 * Download TheSession.org JSON data files locally
 * This script downloads the JSON files to a local data directory for processing
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL =
  'https://raw.githubusercontent.com/adactio/TheSession-data/main/json';
const DATA_DIR = path.join(__dirname, '..', 'data');

// Data files to download (excluding events and sessions)
const DATA_FILES = [
  'tunes.json',
  'recordings.json',
  'tune_popularity.json',
  'aliases.json',
];

/**
 * Download a file from URL to local path
 */
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
          );
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });

        file.on('error', err => {
          fs.unlink(filePath, () => {}); // Delete partial file
          reject(err);
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

/**
 * Get file size in a human-readable format
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const bytes = stats.size;

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main download function
 */
async function downloadData() {
  console.log('🎵 Downloading TheSession.org data files...');
  console.log('='.repeat(50));

  // Create data directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`📁 Created data directory: ${DATA_DIR}`);
  }

  const results = [];

  for (const fileName of DATA_FILES) {
    try {
      const url = `${BASE_URL}/${fileName}`;
      const filePath = path.join(DATA_DIR, fileName);

      console.log(`\n🔄 Downloading ${fileName}...`);
      console.log(`📡 URL: ${url}`);

      const startTime = Date.now();
      await downloadFile(url, filePath);
      const duration = Date.now() - startTime;

      const fileSize = getFileSize(filePath);
      console.log(`✅ Downloaded ${fileName} (${fileSize}) in ${duration}ms`);

      results.push({
        fileName,
        filePath,
        fileSize,
        duration,
        success: true,
      });
    } catch (error) {
      console.error(`❌ Failed to download ${fileName}:`, error.message);
      results.push({
        fileName,
        error: error.message,
        success: false,
      });
    }
  }

  // Summary
  console.log('\n📊 DOWNLOAD SUMMARY');
  console.log('='.repeat(30));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successfully downloaded: ${successful.length} files`);
  successful.forEach(result => {
    console.log(`   - ${result.fileName} (${result.fileSize})`);
  });

  if (failed.length > 0) {
    console.log(`❌ Failed downloads: ${failed.length} files`);
    failed.forEach(result => {
      console.log(`   - ${result.fileName}: ${result.error}`);
    });
  }

  console.log(`\n💾 Data files saved to: ${DATA_DIR}`);
  console.log('\n🎉 Download complete!');

  return results;
}

// Run if called directly
if (require.main === module) {
  downloadData().catch(error => {
    console.error('💥 Download failed:', error);
    process.exit(1);
  });
}

module.exports = { downloadData };
