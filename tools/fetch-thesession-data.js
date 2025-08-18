#!/usr/bin/env node

/**
 * TheSession.org Data Fetcher
 * 
 * Downloads and caches data from TheSession.org for local development
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/adactio/TheSession-data/main/json';
const DATA_DIR = path.join(__dirname, '..', 'data', 'thesession');

// Data files to download
const DATA_FILES = [
  'tunes.json',
  'recordings.json', 
  'tune_popularity.json',
  'aliases.json'
];

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Download a file from URL to local path
 */
function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading ${path.basename(localPath)}...`);
    
    const file = fs.createWriteStream(localPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      const totalSize = parseInt(response.headers['content-length'] || '0');
      let downloadedSize = 0;
      
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize > 0) {
          const percentage = Math.round((downloadedSize / totalSize) * 100);
          process.stdout.write(`\r📥 Downloading ${path.basename(localPath)}... ${percentage}%`);
        }
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`\n✅ Downloaded ${path.basename(localPath)} (${(downloadedSize / 1024 / 1024).toFixed(2)} MB)`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(localPath, () => {}); // Delete partial file
        reject(err);
      });
      
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Check if file exists and get its age
 */
function getFileAge(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Date.now() - stats.mtime.getTime();
  } catch (error) {
    return Infinity; // File doesn't exist
  }
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file info
 */
function getFileInfo(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      modified: stats.mtime,
      age: Date.now() - stats.mtime.getTime()
    };
  } catch (error) {
    return {
      exists: false,
      size: 0,
      modified: null,
      age: Infinity
    };
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🎵 TheSession.org Data Fetcher');
  console.log('==============================');
  
  // Ensure data directory exists
  ensureDir(DATA_DIR);
  
  // Check command line arguments
  const args = process.argv.slice(2);
  const forceDownload = args.includes('--force') || args.includes('-f');
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`🔄 Force download: ${forceDownload ? 'Yes' : 'No'}`);
  console.log(`⏰ Max file age: ${maxAge / (60 * 60 * 1000)} hours`);
  console.log('');
  
  const downloadTasks = [];
  const skippedFiles = [];
  
  // Check each file
  for (const fileName of DATA_FILES) {
    const localPath = path.join(DATA_DIR, fileName);
    const fileInfo = getFileInfo(localPath);
    
    console.log(`📄 ${fileName}:`);
    
    if (fileInfo.exists) {
      console.log(`   Size: ${formatFileSize(fileInfo.size)}`);
      console.log(`   Modified: ${fileInfo.modified?.toISOString()}`);
      console.log(`   Age: ${Math.round(fileInfo.age / (60 * 60 * 1000))} hours`);
      
      if (!forceDownload && fileInfo.age < maxAge) {
        console.log(`   ✅ File is recent, skipping download`);
        skippedFiles.push(fileName);
        console.log('');
        continue;
      }
    } else {
      console.log(`   ❌ File does not exist`);
    }
    
    console.log(`   🔄 Will download`);
    console.log('');
    
    const url = `${BASE_URL}/${fileName}`;
    downloadTasks.push({ url, localPath, fileName });
  }
  
  if (downloadTasks.length === 0) {
    console.log('🎉 All files are up to date!');
    return;
  }
  
  console.log(`📥 Downloading ${downloadTasks.length} files...`);
  console.log('');
  
  // Download files sequentially to be respectful to the server
  for (const { url, localPath, fileName } of downloadTasks) {
    try {
      await downloadFile(url, localPath);
      
      // Add a small delay between downloads
      if (downloadTasks.indexOf(downloadTasks.find(t => t.fileName === fileName)) < downloadTasks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Failed to download ${fileName}:`, error.message);
    }
  }
  
  console.log('');
  console.log('📊 Download Summary:');
  console.log('===================');
  
  // Show final status
  for (const fileName of DATA_FILES) {
    const localPath = path.join(DATA_DIR, fileName);
    const fileInfo = getFileInfo(localPath);
    
    if (fileInfo.exists) {
      const status = skippedFiles.includes(fileName) ? '⏭️  Skipped' : '✅ Downloaded';
      console.log(`${status} ${fileName} (${formatFileSize(fileInfo.size)})`);
    } else {
      console.log(`❌ Failed   ${fileName}`);
    }
  }
  
  console.log('');
  console.log('🎉 Data fetch complete!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Use the data files in your development environment');
  console.log('2. Implement data processing utilities');
  console.log('3. Create search indexes from the downloaded data');
  console.log('');
  console.log('💡 Tips:');
  console.log('- Use --force to re-download all files');
  console.log('- Files are cached for 24 hours by default');
  console.log(`- Data location: ${DATA_DIR}`);
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  downloadFile,
  getFileInfo,
  formatFileSize,
  DATA_DIR,
  DATA_FILES
};