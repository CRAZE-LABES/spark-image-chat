
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, Image } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  accept = "image/*,.pdf,.txt,.doc,.docx", 
  maxSize = 10 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={handleClick}
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        title="Upload file or image"
      >
        <Upload className="w-4 h-4" />
      </Button>
    </>
  );
};

export default FileUpload;
