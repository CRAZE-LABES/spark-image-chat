import React from 'react';
import { FileText, Download, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Attachment {
  type: 'image' | 'document';
  url: string;
  name: string;
}

interface MessageAttachmentsProps {
  attachments: Attachment[];
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ 
  attachments = [], 
  imageUrl, 
  fileUrl, 
  fileName 
}) => {
  // Handle legacy imageUrl and fileUrl props
  const allAttachments: Attachment[] = [...attachments];
  
  if (imageUrl) {
    allAttachments.push({
      type: 'image',
      url: imageUrl,
      name: 'Image'
    });
  }
  
  if (fileUrl && fileName) {
    allAttachments.push({
      type: 'document',
      url: fileUrl,
      name: fileName
    });
  }

  if (allAttachments.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {allAttachments.map((attachment, index) => (
        <div key={index}>
          {attachment.type === 'image' ? (
            <div className="relative group">
              <img 
                src={attachment.url} 
                alt={attachment.name}
                className="max-w-sm rounded-lg shadow-md border hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.open(attachment.url, '_blank')}
                onError={(e) => {
                  console.error('Image failed to load:', attachment.url);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
              <FileText className="w-6 h-6 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                <p className="text-xs text-gray-500">Document</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(attachment.url, '_blank')}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageAttachments;