
import { useState } from "react";
import { Send, Mic, Paperclip, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'ai'}>>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I'm a Gemini-powered AI assistant designed to look like ChatGPT. How can I help you today?",
        sender: 'ai' as const
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-3xl mx-auto px-6">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">G</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  What can I help with?
                </h1>
                <p className="text-gray-600 text-lg">
                  I'm powered by Gemini AI with a ChatGPT-style interface
                </p>
              </div>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">💡 Creative Writing</h3>
                  <p className="text-gray-600 text-sm">Help me write a creative story or poem</p>
                </div>
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">🔍 Research Help</h3>
                  <p className="text-gray-600 text-sm">Find information and analyze data</p>
                </div>
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">💻 Code Assistant</h3>
                  <p className="text-gray-600 text-sm">Help with programming and debugging</p>
                </div>
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">📚 Learning Support</h3>
                  <p className="text-gray-600 text-sm">Explain complex topics and concepts</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Messages
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
                    : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
                } px-4 py-3`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="relative bg-gray-50 rounded-3xl border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-all">
            <div className="flex items-end gap-3 p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Image className="w-4 h-4" />
                </Button>
              </div>
              
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything"
                className="flex-1 border-0 bg-transparent focus:ring-0 text-gray-900 placeholder-gray-500 resize-none"
              />
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm" 
                  className="bg-gray-900 hover:bg-black text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Gemini AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
