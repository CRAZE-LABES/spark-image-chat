
import { MessageSquare, Library, Settings, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    { icon: MessageSquare, label: "ChatGPT", active: true },
    { icon: Library, label: "Explore GPTs" },
    { icon: Library, label: "Library", badge: "45" },
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
            <h2 className="text-lg font-semibold text-gray-900">ChatGPT</h2>
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
            <Button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg">
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
                      ? 'bg-gray-200 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Chats Section */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Chats
              </h3>
              <div className="space-y-1">
                {/* Example chat items */}
                <div className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg cursor-pointer transition-colors">
                  <div className="text-sm font-medium truncate">Previous conversation</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg cursor-pointer transition-colors">
                  <div className="text-sm font-medium truncate">AI assistant help</div>
                  <div className="text-xs text-gray-500">Yesterday</div>
                </div>
              </div>
            </div>
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg cursor-pointer transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Settings</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
