export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'crazegpt_chat_history';

export const saveChatSession = (session: ChatSession): void => {
  try {
    const existingSessions = getChatHistory();
    const updatedSessions = existingSessions.filter(s => s.id !== session.id);
    updatedSessions.unshift(session);
    
    // Keep only the latest 50 sessions
    const limitedSessions = updatedSessions.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedSessions));
    console.log('Chat session saved:', session.title);
  } catch (error) {
    console.error('Failed to save chat session:', error);
  }
};

export const getChatHistory = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const sessions = JSON.parse(stored);
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

export const deleteChatSession = (sessionId: string): void => {
  try {
    const sessions = getChatHistory();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
    console.log('Chat session deleted:', sessionId);
  } catch (error) {
    console.error('Failed to delete chat session:', error);
  }
};

export const generateChatTitle = (firstMessage: string): string => {
  const words = firstMessage.split(' ').slice(0, 4);
  return words.join(' ') + (firstMessage.split(' ').length > 4 ? '...' : '');
};
