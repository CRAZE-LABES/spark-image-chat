
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Clock } from 'lucide-react';
import { ChatSession, deleteChatSession } from '@/services/chatHistoryService';

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ sessions, onSelectSession, onDeleteSession }) => {
  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteChatSession(sessionId);
    onDeleteSession(sessionId);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Chat History
      </h3>
      
      {sessions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No chat history yet</p>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session)}
            className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{session.title}</p>
                <p className="text-xs text-gray-500">{formatDate(session.updatedAt)}</p>
              </div>
            </div>
            <Button
              onClick={(e) => handleDelete(e, session.id)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
