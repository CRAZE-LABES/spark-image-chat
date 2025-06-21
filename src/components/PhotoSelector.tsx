
import React, { useState } from 'react';
import { Image, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PhotoSelectorProps {
  onImageSelect: (imageUrl: string) => void;
  onImageGenerate: (prompt: string) => void;
}

const PhotoSelector: React.FC<PhotoSelectorProps> = ({ onImageSelect, onImageGenerate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageSelect(imageUrl);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      await onImageGenerate(generatePrompt);
      setGeneratePrompt('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
          <Image className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Upload Image */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload an image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Choose File
              </Button>
            </label>
          </div>

          {/* Generate Image */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Or generate an image</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe the image you want to generate..."
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <Button 
                onClick={handleGenerate} 
                disabled={!generatePrompt.trim() || isGenerating}
                size="sm"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoSelector;
