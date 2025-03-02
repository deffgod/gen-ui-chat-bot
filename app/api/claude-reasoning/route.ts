import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { NextRequest, NextResponse } from 'next/server';

// Type for the request body
interface ReasoningRequest {
  prompt: string;
  reasoningBudget?: number;
  useStream?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const body = await req.json() as ReasoningRequest;
    const { prompt, reasoningBudget = 12000, useStream = false } = body;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Generate response with Claude using reasoning
    const result = await generateText({
      model: anthropic('claude-3-sonnet-20240229'),
      prompt,
      providerOptions: {
        anthropic: {
          thinking: { type: 'enabled', budgetTokens: reasoningBudget },
        },
      },
    });
    
    // Process the reasoning output based on its type
    let reasoningText = '';
    if (Array.isArray(result.reasoning)) {
      reasoningText = result.reasoning
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.type === 'text' ? item.text : '')
        .join('\n');
    } else if (typeof result.reasoning === 'string') {
      reasoningText = result.reasoning;
    }
    
    // Return the result
    return NextResponse.json({
      response: result.text,
      thinking: reasoningText,
    });
  } catch (error: any) {
    console.error('Error in Claude reasoning API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

// GET method handler for simple health check
export function GET() {
  return NextResponse.json(
    { status: 'Claude reasoning API is ready' },
    { status: 200 }
  );
} 