import { CodeInterpreter } from '@/components/code-interpreter';
import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Code Interpreter',
  description: 'Solve problems with Python code execution',
};

export default async function CodeInterpreterPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/login');
  }
  
  return (
    <div className="flex flex-col h-dvh">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Code Interpreter</h1>
          <p className="text-sm text-muted-foreground">
            Powered by OpenAI GPT-4o
          </p>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <CodeInterpreter />
      </main>
    </div>
  );
} 