import { useState } from "react";
import { Send, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessageToGemini } from "@/services/geminiApi";
import { generateImage } from "@/services/imageService";
import MessageRenderer from "./MessageRenderer";
import PhotoSelector from "./PhotoSelector";
import TextEditor from "./TextEditor";

const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'ai', imageUrl?: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useTextEditor, setUseTextEditor] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const
    };
    
    setMessages(prev => [...prev, newMessage]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);
    
    try {
      console.log('Sending message to Gemini:', currentMessage);
      const aiResponse = await sendMessageToGemini(currentMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai' as const
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and try again.`,
        sender: 'ai' as const
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    const imageMessage = {
      id: Date.now(),
      text: "Here's the image you selected:",
      sender: 'user' as const,
      imageUrl
    };
    setMessages(prev => [...prev, imageMessage]);
  };

  const handleImageGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const generatedImage = await generateImage({ prompt });
      const imageMessage = {
        id: Date.now(),
        text: `Generated image: "${prompt}"`,
        sender: 'ai' as const,
        imageUrl: generatedImage.url
      };
      setMessages(prev => [...prev, imageMessage]);
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage = {
        id: Date.now(),
        text: 'Sorry, I had trouble generating that image. Please try again.',
        sender: 'ai' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
                  I can format text with **bold**, *italic*, `code`, generate images, and help with file creation
                </p>
              </div>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">✨ **Bold Text** Creation</h3>
                  <p className="text-gray-600 text-sm">Create formatted text with bold, italic, and code</p>
                </div>
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">🖼️ Image Generation</h3>
                  <p className="text-gray-600 text-sm">Generate and upload images</p>
                </div>
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">📁 File Generation</h3>
                  <p className="text-gray-600 text-sm">Help create .zip files and other documents</p>
                </div>
                <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-colors border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">✍️ Text Editing</h3>
                  <p className="text-gray-600 text-sm">Advanced text editing with formatting tools</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Messages
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-3xl">
                  <MessageRenderer content={msg.text} sender={msg.sender} />
                  {msg.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={msg.imageUrl} 
                        alt="Shared image" 
                        className="max-w-sm rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="mb-3 flex gap-2 items-center">
            <Button
              variant={useTextEditor ? "default" : "ghost"}
              size="sm"
              onClick={() => setUseTextEditor(!useTextEditor)}
              className="text-xs"
            >
              {useTextEditor ? "Simple Editor" : "Rich Editor"}
            </Button>
          </div>
          
          <div className="relative bg-gray-50 rounded-3xl border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-all">
            <div className="flex items-end gap-3 p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <PhotoSelector 
                  onImageSelect={handleImageSelect}
                  onImageGenerate={handleImageGenerate}
                />
              </div>
              
              <div className="flex-1">
                {useTextEditor ? (
                  <TextEditor
                    value={message}
                    onChange={setMessage}
                    placeholder="Write your message with rich formatting..."
                  />
                ) : (
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything - I can format text, generate images, and help with files..."
                    disabled={isLoading}
                    className="w-full border-0 bg-transparent focus:ring-0 text-gray-900 placeholder-gray-500 outline-none"
                  />
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  size="sm" 
                  className="bg-gray-900 hover:bg-black text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Gemini AI can format text, generate images, and help with file creation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
