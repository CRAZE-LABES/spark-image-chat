
import { useState, useEffect } from "react";
import { Menu, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatArea from "@/components/ChatArea";
import Sidebar from "@/components/Sidebar";
import LandingPage from "@/components/LandingPage";
import { ChatSession, getChatHistory } from "@/services/chatHistoryService";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = () => {
    const history = getChatHistory();
    setChatSessions(history);
    // If there are existing sessions, don't show landing page
    if (history.length > 0) {
      setShowLanding(false);
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setShowLanding(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    loadChatHistory();
    if (sessionId === currentSessionId) {
      setCurrentSessionId("");
    }
  };

  const handleSessionUpdate = () => {
    loadChatHistory();
    setShowLanding(false);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-white flex w-full">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chatSessions={chatSessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 bg-gray-50 border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Chat Area */}
        <ChatArea 
          selectedSessionId={currentSessionId}
          onSessionUpdate={handleSessionUpdate}
        />
      </div>
    </div>
  );
};

export default Index;
