
import { MessageSquare, Library, Settings, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatHistory from "@/components/ChatHistory";
import { ChatSession } from "@/services/chatHistoryService";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatSessions?: ChatSession[];
  onSelectSession?: (session: ChatSession) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  chatSessions = [], 
  onSelectSession = () => {}, 
  onDeleteSession = () => {} 
}: SidebarProps) => {
  const menuItems = [
    { icon: MessageSquare, label: "CrazeGPT", active: true },
    { icon: Library, label: "Chat Library" },
    { icon: Library, label: "Generated Images", badge: "New" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">CrazeGPT</h2>
              <p className="text-xs text-gray-500">Super Intelligent AI</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              New chat
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    item.active 
                      ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Chat History Section */}
            <div className="mt-8">
              <ChatHistory 
                sessions={chatSessions}
                onSelectSession={onSelectSession}
                onDeleteSession={onDeleteSession}
              />
            </div>
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg cursor-pointer transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Settings</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Created by CraftingCrazeGaming
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
