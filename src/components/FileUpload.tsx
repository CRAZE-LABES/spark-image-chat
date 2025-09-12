
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, Image } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  accept = "image/*,.pdf,.txt,.doc,.docx,.json,.csv", 
  maxSize = 10,
  multiple = false,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} size must be less than ${maxSize}MB`);
        return;
      }
      onFileSelect(file);
    });
    
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
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={handleClick}
        variant="ghost"
        size="sm"
        className={`text-gray-500 hover:text-gray-700 hover:bg-gray-100 ${className}`}
        title="Upload file or image"
      >
        <Upload className="w-4 h-4" />
      </Button>
    </>
  );
};

export default FileUpload;
