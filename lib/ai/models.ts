import { openai } from '@ai-sdk/openai';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { fireworks } from '@ai-sdk/fireworks';

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

/**
 * Note about Claude 3.7 with Reasoning:
 * 
 * Due to type compatibility issues in the current SDK versions, integrating Claude 3.7's 
 * reasoning capabilities directly into this customProvider setup is challenging.
 * 
 * For components or routes that need Claude with reasoning, use the generateText function directly:
 * 
 * ```
 * import { anthropic } from '@ai-sdk/anthropic';
 * import { generateText } from 'ai';
 * 
 * const { text, reasoning } = await generateText({
 *   model: anthropic('claude-3-7-sonnet-20250219'),
 *   prompt: 'Your prompt here',
 *   providerOptions: {
 *     anthropic: {
 *       thinking: { type: 'enabled', budgetTokens: 12000 },
 *     },
 *   },
 * });
 * ```
 * 
 * See lib/ai/claude-reasoning.example.ts for more details.
 */
export const myProvider = customProvider({
  languageModels: {
    "chat-model-small": openai("gpt-4o-mini"),
    "chat-model-large": openai("gpt-4o"),
    "chat-model-reasoning": wrapLanguageModel({
      model: fireworks("accounts/fireworks/models/deepseek-r1"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": openai("gpt-4-turbo"),
    "artifact-model": openai("gpt-4o-mini"),
  },
  imageModels: {
    'small-model': openai.image('dall-e-3'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'title-model',
    name: 'Title model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'artifact-model',
    name: 'Artifact model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'image-model',
    name: 'Image model',
    description: 'Uses advanced reasoning',
  },
];
