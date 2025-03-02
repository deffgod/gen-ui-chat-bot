#!/usr/bin/env node

/**
 * This script checks if environment variables are correctly loaded
 */

// Load environment variables from .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.error('Error loading dotenv:', error.message);
}

// Check for Anthropic API key
const anthropicKey = process.env.ANTHROPIC_API_KEY;
console.log('ANTHROPIC_API_KEY:', anthropicKey ? '✅ Present' : '❌ Missing');

// Check for other important environment variables
const openaiKey = process.env.OPENAI_API_KEY;
console.log('OPENAI_API_KEY:', openaiKey ? '✅ Present' : '❌ Missing');

// Print masked keys for verification
if (anthropicKey) {
  const maskedKey = anthropicKey.substring(0, 8) + '...' + 
    (anthropicKey.length > 12 ? anthropicKey.substring(anthropicKey.length - 4) : '');
  console.log(`Anthropic Key (masked): ${maskedKey}`);
}

if (openaiKey) {
  const maskedKey = openaiKey.substring(0, 8) + '...' + 
    (openaiKey.length > 12 ? openaiKey.substring(openaiKey.length - 4) : '');
  console.log(`OpenAI Key (masked): ${maskedKey}`);
} 