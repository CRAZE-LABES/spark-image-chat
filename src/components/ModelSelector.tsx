
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Zap, Sparkles, Code } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const models = [
    { id: 'deepseek-chat', name: 'DeepSeek v3.1', icon: Brain, description: 'Most Advanced' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', icon: Code, description: 'Programming Expert' },
    { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', icon: Sparkles, description: 'Logical Analysis' },
    { id: 'deepseek-fast', name: 'DeepSeek Fast', icon: Zap, description: 'Quick Response' }
  ];

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-2">
              <model.icon className="w-4 h-4" />
              <div>
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-gray-500">{model.description}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;
