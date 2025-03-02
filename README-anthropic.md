# Setting Up Anthropic Claude Models

This application uses Anthropic Claude models for artifact generation, reasoning, and UI component creation. To use these features, you need to set up an Anthropic API key.

## Getting an Anthropic API Key

1. Go to the [Anthropic Console](https://console.anthropic.com/)
2. Sign up or sign in to your account
3. Navigate to API Keys section: https://console.anthropic.com/settings/keys
4. Create a new API key
5. Copy the API key (it starts with `sk-ant-api...`)

## Setting up the API Key

### Method 1: Using the setup script

Run the following command, replacing `YOUR_API_KEY` with your actual API key:

```bash
node scripts/setup-anthropic.js YOUR_API_KEY
```

### Method 2: Manual setup

Add the following line to your `.env.local` file:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## Verifying your setup

To check if your API key is correctly configured, run:

```bash
node scripts/check-anthropic-api-key.js
```

To test the API connectivity, run:

```bash
npx tsx -r dotenv/config scripts/test-anthropic.ts
```

## Troubleshooting

If you encounter the error:

```
AI_LoadAPIKeyError: Anthropic API key is missing. Pass it using the 'apiKey' parameter or the ANTHROPIC_API_KEY environment variable.
```

This means the application couldn't find your Anthropic API key. Please:

1. Make sure you've added the API key to your `.env.local` file
2. Restart your development server to load the new environment variables
3. Check that the API key is valid and not expired

## Available Claude Models

This application includes the following Claude models:

- **Claude 3 Haiku** (claude-haiku-model): Fast, compact model for simple tasks
- **Claude 3 Sonnet** (claude-sonnet-model): Balanced model for most tasks
- **Claude 3 Opus** (claude-opus-model): Most powerful model for complex tasks
- **Claude 3.5 Sonnet** (claude-3.5-sonnet-model): Latest model with improved capabilities

## Specialized Claude Functions

- **Claude Reasoning** (chat-model-reasoning): Includes step-by-step reasoning capabilities
- **Claude Artifact Generator** (artifact-model): Optimized for artifact and UI generation

For more information, see the [Anthropic Claude documentation](https://docs.anthropic.com/claude/docs). 