/**
 * Claude Reasoning Example
 * 
 * This file provides an example of how to use Claude 3.7 Sonnet with reasoning capabilities.
 * NOTE: This is an EXAMPLE file only, not meant to be imported directly into your application
 * due to type compatibility issues between different versions of the AI SDK.
 */

/**
 * Example code (for reference only, do not uncomment and use directly):
 * 
 * ```typescript
 * import { anthropic } from '@ai-sdk/anthropic';
 * import { generateText } from 'ai';
 * 
 * // Generate text using Claude 3.7 Sonnet with reasoning capabilities
 * async function generateWithClaudeReasoning(prompt: string, budgetTokens: number = 12000) {
 *   try {
 *     // Note: The actual response structure may vary based on your AI SDK version
 *     const result = await generateText({
 *       model: anthropic('claude-3-7-sonnet-20250219'),
 *       prompt,
 *       providerOptions: {
 *         anthropic: {
 *           thinking: { type: 'enabled', budgetTokens },
 *         },
 *       },
 *     });
 * 
 *     // Return only the properties known to be available across SDK versions
 *     return {
 *       text: result.text,
 *       reasoning: result.reasoning
 *     };
 *   } catch (error) {
 *     console.error('Error using Claude with reasoning:', error);
 *     throw error;
 *   }
 * }
 * ```
 */

/**
 * Example usage:
 * 
 * ```typescript
 * // In your component or API route:
 * const result = await generateWithClaudeReasoning('How many people will live in the world in 2040?');
 * console.log(result.text); // The final answer
 * console.log(result.reasoning); // The reasoning process used by Claude
 * ```
 * 
 * Important Notes:
 * 
 * 1. Type compatibility issues exist between different versions of the AI SDK
 * 2. The structure of the response object from generateText may vary
 * 3. You may need to adapt this example to your specific AI SDK version
 * 4. Consider using the direct Anthropic API for more control
 * 5. Make sure all your AI SDK packages (@ai-sdk/anthropic, ai, etc.) are compatible
 */ 