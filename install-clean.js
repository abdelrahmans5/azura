#!/usr/bin/env node

// Ultra-clean install script for Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧹 Starting ULTRA-CLEAN install process...');
console.log('📅 Deployment timestamp:', new Date().toISOString());

// Remove ALL potential lock files and caches
const filesToRemove = ['package-lock.json', 'npm-shrinkwrap.json', '.npmrc'];
filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`�️  Removing ${file}...`);
        fs.unlinkSync(file);
    }
});

// Create a clean .npmrc for this install
console.log('⚙️  Creating clean .npmrc...');
fs.writeFileSync('.npmrc', `legacy-peer-deps=true
strict-peer-deps=false
auto-install-peers=true
fund=false
audit=false`);

// Clean npm cache
console.log('🧽 Cleaning npm cache...');
try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (e) {
    console.log('Cache clean failed, continuing...');
}

// Install with the cleanest possible approach
console.log('📦 Installing dependencies with maximum compatibility...');
try {
    execSync('npm install --no-package-lock --legacy-peer-deps --no-fund --no-audit', { stdio: 'inherit' });
    console.log('✅ Ultra-clean install completed successfully!');
} catch (error) {
    console.error('❌ Install failed:', error.message);

    // Fallback: try with even more permissive flags
    console.log('🔄 Trying fallback install with --force...');
    try {
        execSync('npm install --force --legacy-peer-deps', { stdio: 'inherit' });
        console.log('✅ Fallback install succeeded!');
    } catch (fallbackError) {
        console.error('❌ Fallback install also failed:', fallbackError.message);
        process.exit(1);
    }
}
