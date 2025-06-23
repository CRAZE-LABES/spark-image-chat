
import React from 'react';
import { Bold, Image, File } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface MessageRendererProps {
  content: string;
  sender: 'user' | 'ai';
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content, sender }) => {
  const renderFormattedText = (text: string) => {
    // Handle code blocks first (```code```)
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push({ type: 'text', content: beforeText });
      }
      
      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push({ type: 'code', content: code, language });
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    // If no code blocks found, treat as regular text
    if (parts.length === 0) {
      parts = [{ type: 'text', content: text }];
    }

    return parts.map((part, index) => {
      if (part.type === 'code') {
        return <CodeBlock key={index} code={part.content} language={part.language} />;
      } else {
        // Apply markdown formatting to text parts
        let formatted = part.content;
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
        formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
        formatted = formatted.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>');
        
        return (
          <div 
            key={index}
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }
    });
  };

  return (
    <div className={`max-w-3xl ${
      sender === 'user' 
        ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
        : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
    } px-4 py-3`}>
      <div className="overflow-hidden">
        {renderFormattedText(content)}
      </div>
      
      {sender === 'ai' && (
        <div className="mt-3 flex gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Bold className="w-3 h-3" />
            <span>Text formatting</span>
          </div>
          <div className="flex items-center gap-1">
            <Image className="w-3 h-3" />
            <span>Image analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <File className="w-3 h-3" />
            <span>File generation</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageRenderer;
