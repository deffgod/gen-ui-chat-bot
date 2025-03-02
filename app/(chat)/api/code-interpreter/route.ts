import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/app/(auth)/auth';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Keep a map of assistant IDs to avoid recreating them
const assistantCache = new Map<string, string>();

// Helper function to create or get an assistant
async function getAssistant() {
  // Use a consistent key for the assistant
  const cacheKey = 'default-code-interpreter';
  
  // Check cache first
  if (assistantCache.has(cacheKey)) {
    return assistantCache.get(cacheKey) as string;
  }

  // Create a new assistant
  const assistant = await openai.beta.assistants.create({
    name: "Code Interpreter Assistant",
    instructions: "You are a helpful AI assistant that can write and execute code to solve problems. Analyze user requests carefully and write precise, efficient code. Explain your approach and results clearly.",
    model: "gpt-4o",
    tools: [{ type: "code_interpreter" }]
  });

  // Store in cache
  assistantCache.set(cacheKey, assistant.id);
  return assistant.id;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, threadId, message, fileIds } = await request.json();
    
    // Get or create the assistant
    const assistantId = await getAssistant();

    switch (action) {
      case 'createThread': {
        // Create a new thread
        const thread = await openai.beta.threads.create();
        return NextResponse.json({ threadId: thread.id });
      }
      
      case 'sendMessage': {
        if (!threadId) {
          return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
        }
        
        if (!message) {
          return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Add message to thread
        const messageParams: {
          role: "user";
          content: string;
          file_ids?: string[];
        } = {
          role: "user",
          content: message
        };

        // If fileIds are provided, attach them to the message
        if (fileIds && fileIds.length > 0) {
          messageParams.file_ids = fileIds;
        }

        await openai.beta.threads.messages.create(threadId, messageParams);
        
        // Run the assistant on the thread
        // Ensure threadId is a string as required by the API
        const validThreadId = String(threadId);
        const run = await openai.beta.threads.runs.create(validThreadId, {
          assistant_id: assistantId
        });

        return NextResponse.json({ runId: run.id });
      }
      
      case 'checkRunStatus': {
        if (!threadId) {
          return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
        }
        
        const runId = message; // In this case, message contains the runId
        
        if (!runId) {
          return NextResponse.json({ error: 'Run ID is required' }, { status: 400 });
        }

        // Ensure threadId and runId are strings as required by the API
        const validThreadId = String(threadId);
        const validRunId = String(runId);
        const runStatus = await openai.beta.threads.runs.retrieve(validThreadId, validRunId);
        return NextResponse.json({ status: runStatus.status });
      }
      
      case 'getMessages': {
        if (!threadId) {
          return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
        }

        // Ensure threadId is a string as required by the API
        const validThreadId = String(threadId);
        const messages = await openai.beta.threads.messages.list(validThreadId);
        
        // Process messages to a more friendly format
        const processedMessages = messages.data.map((msg: any) => {
          const content = msg.content.map((c: any) => {
            if (c.type === 'text') {
              return {
                type: 'text',
                text: c.text.value
              };
            } else if (c.type === 'image_file') {
              return {
                type: 'image',
                fileId: c.image_file.file_id
              };
            }
            return c;
          });
          
          return {
            id: msg.id,
            role: msg.role,
            content,
            createdAt: msg.created_at
          };
        });
        
        return NextResponse.json({ messages: processedMessages });
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in code interpreter API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

// File upload endpoint
export async function PUT(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create a proper file object that meets OpenAI's requirements
    const fileContent = await file.arrayBuffer();
    
    // Upload to OpenAI
    const uploadedFile = await openai.files.create({
      // Use the File object directly instead of converting to Blob
      file,
      purpose: 'assistants',
    });

    return NextResponse.json({ fileId: uploadedFile.id });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

// File retrieval endpoint
export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
  }

  try {
    const fileContent = await openai.files.content(fileId);
    
    // Convert the response to a readable stream
    const reader = fileContent.body?.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      }
    });

    // Get file metadata to determine content type
    const fileInfo = await openai.files.retrieve(fileId);
    
    // Use a safer approach for content type
    const contentType = 'application/octet-stream'; // Default to binary
    
    return new Response(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Error retrieving file:', error);
    return NextResponse.json(
      { error: error.message || 'File retrieval failed' },
      { status: 500 }
    );
  }
} 