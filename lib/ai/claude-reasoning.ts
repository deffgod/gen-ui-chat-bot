/**
 * Claude Reasoning Utility
 * 
 * This file provides a utility function for using Claude 3.7 Sonnet with reasoning capabilities.
 * This approach uses the direct generateText function rather than the custom provider setup in models.ts
 * to avoid type incompatibility issues.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

/**
 * Generate text using Claude 3.7 Sonnet with reasoning capabilities
 * 
 * @param prompt The prompt to send to the model
 * @param budgetTokens Optional token budget for reasoning (default: 12000)
 * @returns Object containing text response, reasoning text, and detailed reasoning information
 */
export async function generateWithClaudeReasoning(prompt: string, budgetTokens: number = 12000) {
  const { text, reasoning, reasoningDetails } = await generateText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    prompt,
    providerOptions: {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens },
      },
    },
  });

  return {
    text,
    reasoning,
    reasoningDetails
  };
}

/**
 * Example usage:
 * 
 * import { generateWithClaudeReasoning } from '@/lib/ai/claude-reasoning';
 * 
 * // In your component or API route:
 * const result = await generateWithClaudeReasoning('How many people will live in the world in 2040?');
 * console.log(result.text); // The final answer
 * console.log(result.reasoning); // The reasoning process used by Claude
 */ 