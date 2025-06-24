
import React from 'react';
import { Bold, Image, File, Copy, TextSelect, Edit2 } from 'lucide-react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import CodeBlock from './CodeBlock';

interface MessageRendererProps {
  content: string;
  sender: 'user' | 'ai';
  messageId?: number;
  onEditMessage?: (messageId: number) => void;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content, sender, messageId, onEditMessage }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleSelectText = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      const messageElement = document.getElementById(`message-${messageId}`);
      if (messageElement) {
        range.selectNodeContents(messageElement);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const handleEditMessage = () => {
    if (messageId && onEditMessage) {
      onEditMessage(messageId);
    }
  };

  const renderFormattedText = (text: string) => {
    // Handle code blocks first (```code```)
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push({ type: 'text', content: beforeText });
      }
      
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push({ type: 'code', content: code, language });
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    if (parts.length === 0) {
      parts = [{ type: 'text', content: text }];
    }

    return parts.map((part, index) => {
      if (part.type === 'code') {
        return <CodeBlock key={index} code={part.content} language={part.language} />;
      } else {
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
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          id={`message-${messageId}`}
          className={`max-w-3xl ${
            sender === 'user' 
              ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
              : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
          } px-4 py-3 cursor-pointer select-text`}
        >
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
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
        <ContextMenuItem onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
          <Copy className="w-4 h-4" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={handleSelectText} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
          <TextSelect className="w-4 h-4" />
          Select Text
        </ContextMenuItem>
        {sender === 'user' && messageId && onEditMessage && (
          <ContextMenuItem onClick={handleEditMessage} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
            <Edit2 className="w-4 h-4" />
            Edit Message
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageRenderer;
