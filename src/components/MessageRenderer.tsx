
import React from 'react';
import { Bold, Image, File } from 'lucide-react';

interface MessageRendererProps {
  content: string;
  sender: 'user' | 'ai';
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content, sender }) => {
  // Function to render markdown-like formatting
  const renderFormattedText = (text: string) => {
    // Convert **bold** to <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert __bold__ to <strong>
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
    // Convert *italic* to <em>
    formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    // Convert _italic_ to <em>
    formatted = formatted.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
    // Convert `code` to <code>
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
    // Convert ```code blocks``` to <pre><code>
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>');
    
    return formatted;
  };

  return (
    <div className={`max-w-3xl ${
      sender === 'user' 
        ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
        : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
    } px-4 py-3`}>
      <div 
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ 
          __html: renderFormattedText(content) 
        }}
      />
      
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
