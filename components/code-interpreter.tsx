'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Send, Loader2, FileText, Image } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: Array<{
    type: string;
    text?: string;
    fileId?: string;
  }>;
  createdAt: number;
}

export function CodeInterpreter() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize a thread on first load
  useEffect(() => {
    const initializeThread = async () => {
      try {
        const response = await fetch('/api/code-interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'createThread' }),
        });
        
        if (!response.ok) throw new Error('Failed to create thread');
        
        const data = await response.json();
        setThreadId(data.threadId);
      } catch (error) {
        console.error('Error initializing thread:', error);
      }
    };
    
    if (!threadId) {
      initializeThread();
    }
  }, [threadId]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for run status when a run is active
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (threadId && runId && isRunning) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch('/api/code-interpreter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'checkRunStatus',
              threadId,
              message: runId,
            }),
          });
          
          if (!response.ok) throw new Error('Failed to check run status');
          
          const data = await response.json();
          
          if (['completed', 'failed', 'cancelled', 'expired'].includes(data.status)) {
            setIsRunning(false);
            fetchMessages();
          }
        } catch (error) {
          console.error('Error checking run status:', error);
          setIsRunning(false);
        }
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [threadId, runId, isRunning]);

  const fetchMessages = async () => {
    if (!threadId) return;
    
    try {
      const response = await fetch('/api/code-interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getMessages',
          threadId,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!threadId || !input.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Add user message to UI immediately for better UX
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: [{ type: 'text', text: input }],
          createdAt: Date.now(),
        },
      ]);
      
      const response = await fetch('/api/code-interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          threadId,
          message: input,
          fileIds: uploadedFiles.map(f => f.id),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      setRunId(data.runId);
      setIsRunning(true);
      setInput('');
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/code-interpreter', {
          method: 'PUT',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Failed to upload file');
        
        const data = await response.json();
        setUploadedFiles((prev) => [...prev, { id: data.fileId, name: file.name }]);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    
    setIsLoading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderMessageContent = (content: any) => {
    if (content.type === 'text') {
      // Add proper styling for code blocks in messages
      const formattedText = content.text.replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-muted p-4 rounded-md overflow-x-auto"><code>$1</code></pre>'
      );
      
      return (
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    } else if (content.type === 'image') {
      return (
        <div className="mt-2">
          <a 
            href={`/api/code-interpreter?fileId=${content.fileId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-500 hover:underline"
          >
            <Image size={16} />
            View Image
          </a>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 space-y-4 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">
              Start by sending a message to the Code Interpreter. You can also upload files for analysis.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content.map((item, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    {renderMessageContent(item)}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="p-2 border-t">
          <p className="text-sm font-medium mb-2">Attached files:</p>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 bg-muted p-2 rounded-md text-sm"
              >
                <FileText size={14} />
                <span className="truncate max-w-[150px]">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask the Code Interpreter anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isRunning}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isRunning}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || isRunning}
          >
            {isLoading || isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isRunning ? 'Processing...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 