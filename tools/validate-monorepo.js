#!/usr/bin/env node

/**
 * Validate and fix monorepo structure
 * This script checks the monorepo structure and creates missing projects
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Expected monorepo structure
const EXPECTED_STRUCTURE = {
  apps: ['pwa', 'api-server', 'graphql-server'],
  packages: ['shared-types', 'utils', 'data-processing', 'search-engine'],
};

/**
 * Check if a directory exists
 */
function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * Create a basic package.json for a package
 */
function createPackageJson(name, type = 'package') {
  const isApp = type === 'app';
  const scope = isApp ? '' : '@tunebook/';

  return {
    name: `${scope}${name}`,
    version: '0.1.0',
    description: `${isApp ? 'Application' : 'Package'}: ${name}`,
    main: isApp ? 'dist/index.js' : 'dist/index.js',
    types: isApp ? undefined : 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
      dev: isApp ? 'tsc --watch' : 'tsc --watch',
      clean: 'rm -rf dist',
      'type-check': 'tsc --noEmit',
    },
    files: isApp ? ['dist'] : ['dist', 'src'],
    keywords: ['tunebook', 'irish-music'],
    author: 'Tunebook',
    license: 'MIT',
    devDependencies: {
      typescript: '^5.1.6',
    },
  };
}

/**
 * Create a basic tsconfig.json for a project
 */
function createTsConfig(name, type = 'package') {
  const isApp = type === 'app';

  return {
    extends: '../../tsconfig.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
      declaration: !isApp,
      declarationMap: !isApp,
      sourceMap: true,
      noEmit: false,
      moduleResolution: 'node',
    },
    include: ['src/**/*'],
    exclude: ['dist', 'node_modules', '**/*.test.ts', '**/*.spec.ts'],
    references: isApp ? [{ path: '../shared-types' }] : [],
  };
}

/**
 * Create a basic index.ts file
 */
function createIndexFile(name, type = 'package') {
  const isApp = type === 'app';

  if (isApp) {
    return `/**
 * ${name} application entry point
 */

console.log('🎵 ${name} starting...');

export {};
`;
  } else {
    return `/**
 * @tunebook/${name}
 * 
 * ${name} package for Tunebook monorepo
 */

export * from './types';
`;
  }
}

/**
 * Create a basic types.ts file for packages
 */
function createTypesFile(name) {
  return `/**
 * Types for @tunebook/${name}
 */

export interface ${name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}Config {
  // TODO: Define configuration interface
}
`;
}

/**
 * Create a project directory structure
 */
function createProject(name, type = 'package') {
  const basePath = path.join(
    ROOT_DIR,
    type === 'app' ? 'apps' : 'packages',
    name
  );
  const srcPath = path.join(basePath, 'src');

  console.log(`📁 Creating ${type}: ${name}`);

  // Create directories
  fs.mkdirSync(basePath, { recursive: true });
  fs.mkdirSync(srcPath, { recursive: true });

  // Create package.json
  const packageJson = createPackageJson(name, type);
  fs.writeFileSync(
    path.join(basePath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create tsconfig.json
  const tsConfig = createTsConfig(name, type);
  fs.writeFileSync(
    path.join(basePath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // Create source files
  const indexContent = createIndexFile(name, type);
  fs.writeFileSync(path.join(srcPath, 'index.ts'), indexContent);

  if (type === 'package') {
    const typesContent = createTypesFile(name);
    fs.writeFileSync(path.join(srcPath, 'types.ts'), typesContent);
  }

  console.log(`✅ Created ${type}: ${name}`);
}

/**
 * Validate monorepo structure
 */
function validateMonorepo() {
  console.log('🔍 Validating monorepo structure...');
  console.log('='.repeat(50));

  const issues = [];
  const created = [];

  // Check apps
  console.log('\n📱 Checking apps...');
  for (const appName of EXPECTED_STRUCTURE.apps) {
    const appPath = path.join(ROOT_DIR, 'apps', appName);
    if (!directoryExists(appPath)) {
      console.log(`❌ Missing app: ${appName}`);
      issues.push({ type: 'app', name: appName });
    } else {
      console.log(`✅ Found app: ${appName}`);
    }
  }

  // Check packages
  console.log('\n📦 Checking packages...');
  for (const packageName of EXPECTED_STRUCTURE.packages) {
    const packagePath = path.join(ROOT_DIR, 'packages', packageName);
    if (!directoryExists(packagePath)) {
      console.log(`❌ Missing package: ${packageName}`);
      issues.push({ type: 'package', name: packageName });
    } else {
      console.log(`✅ Found package: ${packageName}`);
    }
  }

  // Report issues
  if (issues.length > 0) {
    console.log(`\n⚠️  Found ${issues.length} missing projects`);

    // Ask user if they want to create missing projects
    console.log('\n🛠️  Creating missing projects...');

    for (const issue of issues) {
      try {
        createProject(issue.name, issue.type);
        created.push(issue);
      } catch (error) {
        console.error(
          `❌ Failed to create ${issue.type}: ${issue.name}`,
          error.message
        );
      }
    }
  } else {
    console.log('\n✅ All expected projects found!');
  }

  // Update root tsconfig.json if projects were created
  if (created.length > 0) {
    console.log('\n📝 Updating root tsconfig.json...');
    updateRootTsConfig();
  }

  // Summary
  console.log('\n📊 VALIDATION SUMMARY');
  console.log('='.repeat(30));
  console.log(
    `✅ Projects found: ${EXPECTED_STRUCTURE.apps.length + EXPECTED_STRUCTURE.packages.length - issues.length}`
  );
  console.log(`🛠️  Projects created: ${created.length}`);

  if (created.length > 0) {
    console.log('\n📋 Next steps:');
    console.log('1. Run "pnpm install" to install dependencies');
    console.log('2. Run "pnpm build" to build all projects');
    console.log('3. Start implementing the created project stubs');
  }

  console.log('\n🎉 Monorepo validation complete!');
}

/**
 * Update root tsconfig.json with all existing projects
 */
function updateRootTsConfig() {
  const tsConfigPath = path.join(ROOT_DIR, 'tsconfig.json');
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

  // Build references array
  const references = [];
  const paths = {};

  // Add apps
  for (const appName of EXPECTED_STRUCTURE.apps) {
    const appPath = path.join(ROOT_DIR, 'apps', appName);
    if (directoryExists(appPath)) {
      references.push({ path: `./apps/${appName}` });
    }
  }

  // Add packages
  for (const packageName of EXPECTED_STRUCTURE.packages) {
    const packagePath = path.join(ROOT_DIR, 'packages', packageName);
    if (directoryExists(packagePath)) {
      references.push({ path: `./packages/${packageName}` });
      paths[`@tunebook/${packageName}`] = [`./packages/${packageName}/src`];
    }
  }

  // Update tsconfig
  tsConfig.references = references;
  tsConfig.compilerOptions.paths = paths;

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  console.log('✅ Updated root tsconfig.json');
}

// Run if called directly
if (require.main === module) {
  validateMonorepo();
}

module.exports = { validateMonorepo };
