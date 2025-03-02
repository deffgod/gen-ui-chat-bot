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
    /**
     * IMPORTANT: Code Interpreter Integration Limitation
     * 
     * The Code Interpreter functionality requires OpenAI's Assistants API, which is not
     * directly compatible with the AI SDK's streamText approach used in this application.
     * 
     * When this model is selected in the UI, the API will return a message explaining this limitation.
     * 
     * To properly implement Code Interpreter functionality:
     * 1. Use OpenAI's Assistants API directly
     * 2. Create a separate API route specifically for Code Interpreter
     * 3. See lib/ai/code-interpreter.example.ts for implementation details
     * 
     * Currently, this model entry acts as a placeholder but will not provide actual code
     * execution capabilities when selected.
     */
    "code-interpreter-model": openai("gpt-4o"),
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
    description: 'Title model for title generation',
  },
  {
    id: 'artifact-model',
    name: 'Artifact model',
    description: 'UI model for artifact generation',
  },
  {
    id: 'image-model',
    name: 'Image model',
    description: 'Image model for image generation',
  },
  {
    id: 'code-interpreter-model',
    name: 'Code Interpreter',
    description: 'Executes Python code to solve problems',
  },
];
