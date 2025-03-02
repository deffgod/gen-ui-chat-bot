/**
 * This script tests the Anthropic API connectivity.
 * 
 * Run with: npx tsx -r dotenv/config scripts/test-anthropic.ts
 */

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

async function testAnthropicAPI() {
  console.log('Testing Anthropic API connectivity...\n');
  
  try {
    // Simple test for Anthropic API
    const result = await generateText({
      model: anthropic('claude-3-haiku-20240307'),
      prompt: 'Say hello in exactly 5 words.',
    });
    
    console.log('✅ SUCCESS: Anthropic API is working!\n');
    console.log('Response:', result.text);
    console.log('\nYour Anthropic API key is correctly configured.\n');
    
    return true;
  } catch (error: any) {
    console.error('❌ ERROR: Failed to connect to Anthropic API\n');
    console.error('Error details:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('\nThe API key seems to be invalid or missing.');
      console.error('Make sure you have added the correct ANTHROPIC_API_KEY in your .env.local file.');
      console.error('You can get an API key from: https://console.anthropic.com/settings/keys\n');
    } else {
      console.error('\nThere might be a network issue or the Anthropic service might be down.');
      console.error('Please try again later or check your network connection.\n');
    }
    
    return false;
  }
}

// Run the test
testAnthropicAPI().then((success) => {
  process.exit(success ? 0 : 1);
}); 