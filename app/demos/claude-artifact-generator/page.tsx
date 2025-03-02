'use client';

import { useState } from 'react';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

// Get API key for Anthropic
const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

interface UIComponentRequest {
  description: string;
  requiredProps?: string[];
  styling?: 'tailwind' | 'css' | 'css-in-js';
  componentType?: 'functional' | 'class';
  complexity?: 'simple' | 'moderate' | 'complex';
  framework?: 'react' | 'next' | 'vue' | 'svelte';
  additionalContext?: string;
}

interface UIComponentResult {
  code: string;
  explanation: string;
  usageExamples: string;
  props: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

// Function to generate UI component with Claude
async function generateUIComponent(request: UIComponentRequest): Promise<UIComponentResult> {
  const framework = request.framework || 'react';
  const styling = request.styling || 'tailwind';
  
  const prompt = `
I need you to create a high-quality ${framework} component with the following details:

Description: ${request.description}
${request.requiredProps ? `Required Props: ${request.requiredProps.join(', ')}` : ''}
Styling Approach: ${styling}
Component Type: ${request.componentType || 'functional'}
Complexity Level: ${request.complexity || 'moderate'}
${request.additionalContext ? `Additional Context: ${request.additionalContext}` : ''}

Please respond with a JSON object that includes:
1. The component code
2. A brief explanation of how it works
3. Usage examples
4. Documentation for all props

Format your response as valid JSON with the following structure:
{
  "code": "// Component code here",
  "explanation": "Explanation here",
  "usageExamples": "Usage examples here",
  "props": [
    {
      "name": "propName",
      "type": "propType",
      "description": "Prop description",
      "required": true/false
    }
  ]
}
`;

  try {
    const { text, reasoning } = await generateText({
      model: anthropic('claude-3-sonnet-20240229'),
      prompt,
      providerOptions: {
        anthropic: {
          thinking: { type: 'enabled', budgetTokens: 12000 },
          responseFormat: { type: 'json' }
        },
      },
    });
    
    // Parse the JSON response
    const result: UIComponentResult = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('Error generating UI component:', error);
    throw error;
  }
}

export default function UIComponentGenerator() {
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<string>('react');
  const [styling, setStyling] = useState<string>('tailwind');
  const [componentCode, setComponentCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [usageExamples, setUsageExamples] = useState('');
  const [propsDoc, setPropsDoc] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setComponentCode('');
    setExplanation('');
    setUsageExamples('');
    setPropsDoc([]);
    
    try {
      const result = await generateUIComponent({
        description,
        framework: framework as any,
        styling: styling as any,
      });
      
      setComponentCode(result.code);
      setExplanation(result.explanation);
      setUsageExamples(result.usageExamples);
      setPropsDoc(result.props || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Claude Artifact Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate UI components with Claude&apos;s AI reasoning capabilities
      </p>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Component Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={3}
            placeholder="Describe the component you want to generate in detail..."
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Framework</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="react">React</option>
              <option value="next">Next.js</option>
              <option value="vue">Vue</option>
              <option value="svelte">Svelte</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700">Styling</label>
            <select
              value={styling}
              onChange={(e) => setStyling(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="tailwind">Tailwind CSS</option>
              <option value="css">CSS</option>
              <option value="css-in-js">CSS-in-JS</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Component'}
        </button>
      </form>
      
      {componentCode && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Component Code</h2>
            <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto">
              <pre>{componentCode}</pre>
            </div>
          </div>
          
          {explanation && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Explanation</h2>
              <div className="bg-gray-100 p-4 rounded-md">
                {explanation}
              </div>
            </div>
          )}
          
          {usageExamples && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Usage Examples</h2>
              <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto">
                <pre>{usageExamples}</pre>
              </div>
            </div>
          )}
          
          {propsDoc && propsDoc.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Props Documentation</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-2 px-4 border-b text-left">Name</th>
                      <th className="py-2 px-4 border-b text-left">Type</th>
                      <th className="py-2 px-4 border-b text-left">Required</th>
                      <th className="py-2 px-4 border-b text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propsDoc.map((prop, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4 border-b">{prop.name}</td>
                        <td className="py-2 px-4 border-b font-mono text-sm">{prop.type}</td>
                        <td className="py-2 px-4 border-b">{prop.required ? 'Yes' : 'No'}</td>
                        <td className="py-2 px-4 border-b">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 