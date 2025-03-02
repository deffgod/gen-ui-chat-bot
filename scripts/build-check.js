// Build check script to verify environment variables before build
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY'
];

console.log('🔍 Checking required environment variables before build...');
let missingVars = [];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
    console.error(`❌ Missing required environment variable: ${envVar}`);
  } else {
    console.log(`✅ Found ${envVar}`);
  }
}

if (missingVars.length > 0) {
  console.error('\n⛔ Build check failed: Missing required environment variables');
  console.error('Please add the following environment variables to your deployment:');
  missingVars.forEach(v => console.error(`  - ${v}`));
  console.error('\nIf deploying to Vercel, add these in Project Settings > Environment Variables');
  console.error('For local development, add them to your .env.local file\n');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are present');
  console.log('Build check passed! Continuing with build process...\n');
} 