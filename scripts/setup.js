#!/usr/bin/env node

/**
 * Setup script for TechLibrary 3D
 * Helps integrate TechLibrary data into the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TECHLIBRARY_REPO = 'https://github.com/arielk3998/TechLibrary-Complete.git';
const DATA_DIR = path.join(__dirname, '../public/data');
const CONTENT_DIR = path.join(__dirname, '../public/techlibrary');

console.log('🚀 TechLibrary 3D Setup\n');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Check for local TechLibrary
const localTechLibPath = process.argv[2];

if (localTechLibPath && fs.existsSync(localTechLibPath)) {
  console.log('📁 Using local TechLibrary path:', localTechLibPath);
  
  // Copy manifest
  const manifestSrc = path.join(localTechLibPath, 'RESOURCE_MANIFEST.json');
  if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, path.join(DATA_DIR, 'RESOURCE_MANIFEST.json'));
    console.log('✅ Copied RESOURCE_MANIFEST.json');
  } else {
    console.log('⚠️  RESOURCE_MANIFEST.json not found');
  }

  // Copy coverage
  const coverageSrc = path.join(localTechLibPath, 'COVERAGE_STATUS.json');
  if (fs.existsSync(coverageSrc)) {
    fs.copyFileSync(coverageSrc, path.join(DATA_DIR, 'COVERAGE_STATUS.json'));
    console.log('✅ Copied COVERAGE_STATUS.json');
  } else {
    console.log('⚠️  COVERAGE_STATUS.json not found');
  }

  console.log('\n✨ Setup complete! Run `npm run dev` to start.');
} else {
  console.log('📋 Setup Options:\n');
  console.log('1. Use mock data (default - already configured)');
  console.log('2. Provide local TechLibrary path:');
  console.log('   node scripts/setup.js /path/to/TechLibrary\n');
  console.log('3. Clone TechLibrary repository:');
  console.log('   git clone ' + TECHLIBRARY_REPO + ' ../TechLibrary');
  console.log('   node scripts/setup.js ../TechLibrary\n');
  console.log('4. Use GitHub API (configure in lib/dataLoader.ts)\n');
  console.log('ℹ️  The app works with mock data by default.');
  console.log('   Real data enhances the experience with actual resources.\n');
}
