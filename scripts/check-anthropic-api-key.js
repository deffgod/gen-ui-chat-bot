#!/usr/bin/env node

/**
 * This script checks if the Anthropic API key is correctly configured.
 * 
 * Run with: node scripts/check-anthropic-api-key.js
 */

// Check if the Anthropic API key is set in the environment
const apiKey = process.env.ANTHROPIC_API_KEY;

console.log('Checking Anthropic API key configuration...');

if (!apiKey) {
  console.error('\n❌ ERROR: Anthropic API key is not set in the environment');
  console.error('\nMake sure you have added the ANTHROPIC_API_KEY in your .env.local file');
  console.error('or set it in your environment before running the application.\n');
  console.error('You can get an API key from: https://console.anthropic.com/settings/keys\n');
  console.error('Add the following to your .env.local file:');
  console.error('ANTHROPIC_API_KEY=your_api_key_here\n');
  process.exit(1);
} else {
  console.log('\n✅ SUCCESS: Anthropic API key is configured\n');
  
  // Mask the API key for security
  const maskedKey = apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4);
  console.log(`Found API key: ${maskedKey}\n`);
  
  console.log('Make sure the API key is valid by running a simple test:');
  console.log('npx tsx -r dotenv/config scripts/test-anthropic.ts\n');
  process.exit(0);
} 