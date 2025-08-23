#!/usr/bin/env node

// Clean install script for Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧹 Starting clean install process...');

// Remove package-lock.json if it exists to force fresh resolution
if (fs.existsSync('package-lock.json')) {
    console.log('📦 Removing existing package-lock.json...');
    fs.unlinkSync('package-lock.json');
}

// Install with legacy peer deps to handle Angular dependency conflicts
console.log('📦 Installing dependencies with legacy peer deps...');
try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    console.log('✅ Clean install completed successfully!');
} catch (error) {
    console.error('❌ Install failed:', error.message);
    process.exit(1);
}
