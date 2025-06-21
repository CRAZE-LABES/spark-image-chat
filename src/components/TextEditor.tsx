
import React, { useState } from 'react';
import { Bold, Italic, Code, Type, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, placeholder }) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleSelectionChange = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setSelection({ start: target.selectionStart, end: target.selectionEnd });
  };

  const wrapText = (wrapper: string) => {
    const { start, end } = selection;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + `${wrapper}${selectedText}${wrapper}` + value.substring(end);
    onChange(newText);
  };

  const insertText = (text: string) => {
    const { start } = selection;
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);
  };

  const enhanceText = async () => {
    if (!value.trim()) return;
    
    // Simulate AI text enhancement
    const enhanced = value
      .split('.')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => {
        // Simple enhancement - make it more descriptive
        if (sentence.length < 20) {
          return sentence + ' with vivid detail and emotion';
        }
        return sentence;
      })
      .join('. ') + '.';
    
    onChange(enhanced);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-2 bg-gray-50 rounded-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapText('**')}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapText('*')}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapText('`')}
          className="h-8 w-8 p-0"
          title="Code"
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertText('### ')}
          className="h-8 w-8 p-0"
          title="Heading"
        >
          <Type className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={enhanceText}
          className="h-8 px-2"
          title="Enhance with AI"
        >
          <Wand2 className="w-4 h-4 mr-1" />
          <span className="text-xs">Enhance</span>
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelectionChange}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
      />
    </div>
  );
};

export default TextEditor;
