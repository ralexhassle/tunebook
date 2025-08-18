#!/usr/bin/env node

/**
 * TheSession.org Data Explorer
 * 
 * This script fetches and analyzes data from TheSession.org GitHub repository
 * to understand the data structure and generate TypeScript types.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/adactio/TheSession-data/main/json';

// Data types to fetch (excluding events, sessions, and sets due to Git LFS)
const DATA_TYPES = [
  'tunes',
  'recordings', 
  'tune_popularity',
  'aliases'
];

// Special URLs for certain data types that need different download URLs
const SPECIAL_URLS = {
  'sets': 'https://github.com/adactio/TheSession-data/raw/refs/heads/main/json/sets.json'
};

/**
 * Fetch JSON data from a URL
 */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON from ${url}: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch ${url}: ${error.message}`));
    });
  });
}

/**
 * Analyze the structure of an object to infer TypeScript types
 */
function analyzeStructure(obj, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return 'any';
  
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  
  const type = typeof obj;
  
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'any[]';
    
    // Analyze first few items to determine array type
    const sampleSize = Math.min(3, obj.length);
    const itemTypes = obj.slice(0, sampleSize).map(item => analyzeStructure(item, depth + 1, maxDepth));
    const uniqueTypes = [...new Set(itemTypes)];
    
    if (uniqueTypes.length === 1) {
      return `${uniqueTypes[0]}[]`;
    } else {
      return `(${uniqueTypes.join(' | ')})[]`;
    }
  }
  
  if (type === 'object') {
    const properties = {};
    for (const [key, value] of Object.entries(obj)) {
      properties[key] = analyzeStructure(value, depth + 1, maxDepth);
    }
    return properties;
  }
  
  return type;
}

/**
 * Generate TypeScript interface from analyzed structure
 */
function generateInterface(name, structure, optional = false) {
  if (typeof structure !== 'object' || Array.isArray(structure)) {
    return `type ${name} = ${structure};`;
  }
  
  let interfaceStr = `interface ${name} {\n`;
  
  for (const [key, type] of Object.entries(structure)) {
    const optionalMarker = optional ? '?' : '';
    
    if (typeof type === 'object' && !Array.isArray(type)) {
      // Nested object - create a nested interface
      const nestedName = `${name}${key.charAt(0).toUpperCase() + key.slice(1)}`;
      interfaceStr += `  ${key}${optionalMarker}: ${nestedName};\n`;
    } else {
      interfaceStr += `  ${key}${optionalMarker}: ${type};\n`;
    }
  }
  
  interfaceStr += '}';
  return interfaceStr;
}

/**
 * Analyze a sample of data and generate insights
 */
function analyzeDataSample(dataType, data) {
  console.log(`\n📊 Analyzing ${dataType.toUpperCase()}`);
  console.log('='.repeat(50));
  
  if (!Array.isArray(data)) {
    console.log('❌ Data is not an array');
    return null;
  }
  
  console.log(`📈 Total items: ${data.length}`);
  
  if (data.length === 0) {
    console.log('❌ No data to analyze');
    return null;
  }
  
  // Analyze first few items
  const sampleSize = Math.min(5, data.length);
  console.log(`🔍 Analyzing first ${sampleSize} items...`);
  
  const samples = data.slice(0, sampleSize);
  
  // Show sample data
  console.log('\n📋 Sample data:');
  samples.forEach((item, index) => {
    console.log(`\n--- Item ${index + 1} ---`);
    console.log(JSON.stringify(item, null, 2));
  });
  
  // Analyze structure
  const structure = analyzeStructure(samples[0]);
  console.log('\n🏗️  Inferred structure:');
  console.log(JSON.stringify(structure, null, 2));
  
  // Generate TypeScript interface
  const interfaceName = dataType.charAt(0).toUpperCase() + dataType.slice(1, -1); // Remove 's' and capitalize
  const tsInterface = generateInterface(interfaceName, structure);
  
  console.log('\n📝 Generated TypeScript interface:');
  console.log(tsInterface);
  
  return {
    dataType,
    totalItems: data.length,
    sampleSize,
    samples,
    structure,
    interface: tsInterface
  };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🎵 TheSession.org Data Explorer');
  console.log('================================');
  console.log(`📡 Fetching data from: ${BASE_URL}`);
  
  const results = {};
  const errors = [];
  
  for (const dataType of DATA_TYPES) {
    try {
      console.log(`\n🔄 Fetching ${dataType}...`);
      const url = SPECIAL_URLS[dataType] || `${BASE_URL}/${dataType}.json`;
      console.log(`📡 URL: ${url}`);
      const data = await fetchJson(url);
      
      const analysis = analyzeDataSample(dataType, data);
      if (analysis) {
        results[dataType] = analysis;
      }
      
      // Add a small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error fetching ${dataType}:`, error.message);
      errors.push({ dataType, error: error.message });
    }
  }
  
  // Generate summary report
  console.log('\n\n📊 SUMMARY REPORT');
  console.log('==================');
  
  console.log('\n✅ Successfully analyzed:');
  Object.keys(results).forEach(dataType => {
    const result = results[dataType];
    console.log(`  - ${dataType}: ${result.totalItems} items`);
  });
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(({ dataType, error }) => {
      console.log(`  - ${dataType}: ${error}`);
    });
  }
  
  // Save results to file
  const outputDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, 'thesession-data-analysis.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    results,
    errors
  }, null, 2));
  
  console.log(`\n💾 Analysis saved to: ${outputFile}`);
  
  // Generate TypeScript types file
  const typesFile = path.join(outputDir, 'thesession-types.ts');
  let typesContent = '// Generated TypeScript types from TheSession.org data analysis\n';
  typesContent += `// Generated on: ${new Date().toISOString()}\n\n`;
  
  Object.values(results).forEach(result => {
    typesContent += `${result.interface}\n\n`;
  });
  
  fs.writeFileSync(typesFile, typesContent);
  console.log(`📝 TypeScript types saved to: ${typesFile}`);
  
  console.log('\n🎉 Data exploration complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the generated types in docs/thesession-types.ts');
  console.log('2. Refine the types based on your analysis');
  console.log('3. Implement the data processing utilities');
  console.log('4. Create the shared-types package with these interfaces');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  fetchJson,
  analyzeStructure,
  generateInterface,
  analyzeDataSample
};