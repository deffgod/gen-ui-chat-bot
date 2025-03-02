#!/usr/bin/env node

/**
 * This script helps set up the Anthropic API key in .env.local
 * 
 * Run with: node scripts/setup-anthropic.js YOUR_API_KEY
 */

const fs = require('fs');
const path = require('path');

// Get API key from command line
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Error: No API key provided');
  console.error('Usage: node scripts/setup-anthropic.js YOUR_API_KEY');
  console.error('\nYou can get an API key from: https://console.anthropic.com/settings/keys');
  process.exit(1);
}

// Path to .env.local
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

// Check if .env.local exists
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if ANTHROPIC_API_KEY already exists
  if (envContent.includes('ANTHROPIC_API_KEY=')) {
    // Replace existing key
    envContent = envContent.replace(
      /ANTHROPIC_API_KEY=.*/,
      `ANTHROPIC_API_KEY="${apiKey}"`
    );
  } else {
    // Add new key
    envContent += `\nANTHROPIC_API_KEY="${apiKey}"\n`;
  }
} else {
  // Create new .env.local file
  envContent = `ANTHROPIC_API_KEY="${apiKey}"\n`;
}

// Write to file
fs.writeFileSync(envPath, envContent);

console.log('✅ Successfully added ANTHROPIC_API_KEY to .env.local');
console.log('\nTo verify your setup, run:');
console.log('node scripts/check-anthropic-api-key.js'); 