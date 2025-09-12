import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  isVisible, 
  message = "CrazeGPT is thinking..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start mb-6">
      <div className="bg-white border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm max-w-xs">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;