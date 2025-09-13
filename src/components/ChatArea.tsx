import { useState, useEffect } from "react";
import { Send, Mic, Paperclip, Download, Plus, Edit2, Check, X, Image as ImageIcon, Trash2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessageToDeepSeek } from "@/services/deepseekApi";
import { generateImage } from "@/services/imageService";
import { generateFile, downloadFile } from "@/services/fileService";
import { ChatSession, ChatMessage, saveChatSession, getChatHistory, generateChatTitle } from "@/services/chatHistoryService";
import MessageRenderer from "./MessageRenderer";
import PhotoSelector from "./PhotoSelector";
import TextEditor from "./TextEditor";
import ModelSelector from "./ModelSelector";
import ChatHistory from "./ChatHistory";
import FileUpload from "./FileUpload";
import TypingIndicator from "./TypingIndicator";

interface StagedFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'document';
}

interface ChatAreaProps {
  selectedSessionId?: string;
  onSessionUpdate?: () => void;
}

const ChatArea = ({ selectedSessionId, onSessionUpdate }: ChatAreaProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useTextEditor, setUseTextEditor] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    loadChatHistory();
    if (!currentSessionId) {
      generateNewSession();
    }
  }, []);

  useEffect(() => {
    if (selectedSessionId && selectedSessionId !== currentSessionId) {
      loadSession(selectedSessionId);
    }
  }, [selectedSessionId]);

  const loadChatHistory = () => {
    const history = getChatHistory();
    setChatHistory(history);
  };

  const loadSession = (sessionId: string) => {
    const history = getChatHistory();
    const session = history.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
    }
  };

  const generateNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setMessages([]);
  };

  const saveCurrentSession = (updatedMessages: ChatMessage[]) => {
    if (updatedMessages.length === 0) return;

    const session: ChatSession = {
      id: currentSessionId,
      title: generateChatTitle(updatedMessages[0].text),
      messages: updatedMessages,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    saveChatSession(session);
    loadChatHistory();
    onSessionUpdate?.();
  };

  const isCodeRelated = (text: string): boolean => {
    const codeKeywords = [
      'code', 'function', 'class', 'variable', 'import', 'export', 'const', 'let', 'var',
      'javascript', 'python', 'java', 'css', 'html', 'react', 'typescript',
      'algorithm', 'programming', 'script', 'syntax', 'debug', 'compile',
      'create function', 'write code', 'fix bug', 'implement', 'refactor'
    ];
    
    const lowerText = text.toLowerCase();
    return codeKeywords.some(keyword => lowerText.includes(keyword)) || 
           text.includes('```') || 
           text.includes('`');
  };

  const handleSendMessage = async () => {
    if (!message.trim() && stagedFiles.length === 0) return;
    
    console.log('Sending message:', message, 'with files:', stagedFiles.length);
    
    const newMessage: ChatMessage = {
      id: Date.now(),
      text: message || (stagedFiles.length > 0 ? "Shared files" : ""),
      sender: 'user',
      timestamp: new Date(),
      model: selectedModel,
      imageUrl: stagedFiles.find(f => f.type === 'image')?.url
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    const currentMessage = message;
    const currentFiles = stagedFiles;
    setMessage("");
    setStagedFiles([]);
    setIsLoading(true);
    
    try {
      if (currentMessage.toLowerCase().includes('create file') || 
          currentMessage.toLowerCase().includes('generate file') ||
          currentMessage.toLowerCase().includes('make a file')) {
        await handleFileGeneration(currentMessage, updatedMessages);
        return;
      }
      
      const conversationContext = updatedMessages
        .slice(-10)
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      let contextualMessage = `Previous conversation context:\n${conversationContext}\n\nCurrent question: ${currentMessage}`;
      
      if (currentFiles.length > 0) {
        const fileDescriptions = currentFiles.map(f => `${f.type}: ${f.file.name}`).join(', ');
        contextualMessage += `\n\nAttached files: ${fileDescriptions}. Please analyze and respond to any images or files shared.`;
      }
      
      if (isCodeRelated(currentMessage)) {
        contextualMessage += '\n\nNote: Format any code examples with proper markdown code blocks using ```language syntax.';
      }
      
      const aiResponse = await sendMessageToDeepSeek(contextualMessage);
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        model: selectedModel
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);
      console.log('AI response received:', aiResponse);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`,
        sender: 'ai',
        timestamp: new Date(),
        model: selectedModel
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = (messageId: number) => {
    const messageToEdit = messages.find(msg => msg.id === messageId);
    if (messageToEdit) {
      setEditingMessageId(messageId);
      setEditingText(messageToEdit.text);
    }
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editingText.trim()) {
      const updatedMessages = messages.map(msg => 
        msg.id === editingMessageId 
          ? { ...msg, text: editingText, timestamp: new Date() }
          : msg
      );
      setMessages(updatedMessages);
      saveCurrentSession(updatedMessages);
      setEditingMessageId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleFileGeneration = async (prompt: string, currentMessages: ChatMessage[]) => {
    try {
      console.log('Generating file for prompt:', prompt);
      
      let fileType: 'txt' | 'json' | 'html' | 'js' | 'css' = 'txt';
      let content = '';
      let filename = '';
      
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('json')) {
        fileType = 'json';
        content = JSON.stringify({ message: "Hello from CrazeGPT!", created: new Date().toISOString() }, null, 2);
        filename = 'crazegpt-data.json';
      } else if (lowerPrompt.includes('html')) {
        fileType = 'html';
        content = `<!DOCTYPE html>
<html>
<head>
    <title>Generated by CrazeGPT</title>
</head>
<body>
    <h1>Hello from CrazeGPT!</h1>
    <p>This file was generated by CrazeGPT, created by CraftingCrazeGaming.</p>
</body>
</html>`;
        filename = 'crazegpt-page.html';
      } else {
        content = `Hello! This file was generated by CrazeGPT.

Created by: CraftingCrazeGaming
Generated on: ${new Date().toLocaleString()}
Prompt: ${prompt}

CrazeGPT is based on Gemini AI and can help you with:
- Text formatting and editing
- Image generation
- File creation
- And much more!`;
        filename = 'crazegpt-file.txt';
      }
      
      const generatedFile = await generateFile({ type: fileType, content, filename });
      
      const fileMessage: ChatMessage = {
        id: Date.now() + 1,
        text: `I've generated a ${fileType.toUpperCase()} file for you! Click the download button to save it.`,
        sender: 'ai',
        timestamp: new Date(),
        fileUrl: generatedFile.url,
        fileName: generatedFile.filename,
        model: selectedModel
      };
      
      const finalMessages = [...currentMessages, fileMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);
      console.log('File generated successfully');
      
    } catch (error) {
      console.error('Error generating file:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I had trouble generating that file. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        model: selectedModel
      };
      const finalMessages = [...currentMessages, errorMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    console.log('Image selected:', imageUrl);
    // Stage the image instead of immediately sending
    const newStagedFile: StagedFile = {
      id: `staged_${Date.now()}`,
      file: new File([], 'selected-image.jpg', { type: 'image/jpeg' }),
      url: imageUrl,
      type: 'image'
    };
    setStagedFiles(prev => [...prev, newStagedFile]);
  };

  const handleImageGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      console.log('Generating image with AI for prompt:', prompt);
      const generatedImage = await generateImage({ prompt });
      const imageMessage: ChatMessage = {
        id: Date.now(),
        text: `Generated image: "${prompt}"`,
        sender: 'ai',
        timestamp: new Date(),
        imageUrl: generatedImage.url,
        model: selectedModel
      };
      const updatedMessages = [...messages, imageMessage];
      setMessages(updatedMessages);
      saveCurrentSession(updatedMessages);
      console.log('Image generated successfully');
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage: ChatMessage = {
        id: Date.now(),
        text: 'Sorry, I had trouble generating that image. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        model: selectedModel
      };
      const updatedMessages = [...messages, errorMessage];
      setMessages(updatedMessages);
      saveCurrentSession(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const newStagedFile: StagedFile = {
        id: `staged_${Date.now()}`,
        file,
        url: e.target?.result as string,
        type: file.type.startsWith('image/') ? 'image' : 'document'
      };
      setStagedFiles(prev => [...prev, newStagedFile]);
    };
    
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleRemoveStagedFile = (fileId: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleTypingIndicator = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleSelectSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    loadChatHistory();
    onSessionUpdate?.();
    if (sessionId === currentSessionId) {
      generateNewSession();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    handleTypingIndicator();
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl font-bold">C</span>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Welcome to CrazeGPT
                </h1>
                <p className="text-gray-600 text-xl mb-2">
                  Your Professional AI Assistant with Infinite Intelligence
                </p>
                <p className="text-gray-500 text-lg">
                  Created by **CraftingCrazeGaming** • Professional AI Assistant
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="font-semibold text-gray-900 mb-2">∞ AI Models</h3>
                  <p className="text-gray-600 text-sm">Unlimited model selection for any task</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-4">💾</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Perfect Memory</h3>
                  <p className="text-gray-600 text-sm">Never forgets your conversations</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Unlimited Code</h3>
                  <p className="text-gray-600 text-sm">Generate any code with instant copy</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-semibent text-gray-900 mb-2">∞ Features</h3>
                  <p className="text-gray-600 text-sm">Infinite capabilities beyond any AI</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Messages with context menu support
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div className="max-w-3xl relative">
                  {editingMessageId === msg.id ? (
                    <div className="bg-white rounded-2xl p-4 border-2 border-blue-400 shadow-lg">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full p-2 border rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <MessageRenderer 
                        content={msg.text} 
                        sender={msg.sender} 
                        messageId={msg.id}
                        onEditMessage={handleEditMessage}
                        imageUrl={msg.imageUrl}
                        fileUrl={msg.fileUrl}
                        fileName={msg.fileName}
                        attachments={msg.attachments}
                      />
                      {msg.sender === 'user' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEditMessage(msg.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                  
                  {msg.imageUrl && (
                    <div className="mt-3">
                      <img 
                        src={msg.imageUrl} 
                        alt="Generated or uploaded image" 
                        className="max-w-sm rounded-lg shadow-md border"
                        onError={(e) => {
                          console.error('Image failed to load:', msg.imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {msg.fileUrl && msg.fileName && (
                    <div className="mt-3">
                      <Button
                        onClick={() => downloadFile(msg.fileUrl!, msg.fileName!)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download {msg.fileName}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Enhanced Typing Indicator */}
            <TypingIndicator isVisible={isLoading} message="CrazeGPT is thinking..." />
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="mb-3 flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <Button
                variant={useTextEditor ? "default" : "ghost"}
                size="sm"
                onClick={() => setUseTextEditor(!useTextEditor)}
                className="text-xs"
              >
                {useTextEditor ? "Simple Mode" : "Rich Editor"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateNewSession}
                className="text-xs"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Chat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs"
              >
                History ({chatHistory.length})
              </Button>
            </div>
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </div>

          {showHistory && (
            <div className="mb-4 max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              <ChatHistory 
                sessions={chatHistory}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
              />
            </div>
          )}
          
          <div className="relative bg-white rounded-3xl border-2 border-gray-200 focus-within:border-blue-400 focus-within:shadow-lg transition-all duration-200">
            {/* Staged Files Preview */}
            {stagedFiles.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-3">
                  {stagedFiles.map((file) => (
                    <div key={file.id} className="relative group">
                      {file.type === 'image' ? (
                        <div className="relative">
                          <img 
                            src={file.url} 
                            alt={file.file.name}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-red-600 hover:text-red-700 p-1 h-auto"
                              onClick={() => handleRemoveStagedFile(file.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              <ImageIcon className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center relative group">
                          <Paperclip className="w-6 h-6 text-gray-500" />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border text-red-600 hover:text-red-700 p-1 h-auto"
                            onClick={() => handleRemoveStagedFile(file.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-1 truncate w-20" title={file.file.name}>
                        {file.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-end gap-3 p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <FileUpload 
                  onFileSelect={handleFileUpload}
                  multiple={true}
                  accept="image/*,.pdf,.txt,.doc,.docx,.json,.csv,.py,.js,.html,.css"
                />
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
                    placeholder="Write with rich formatting... Try: **bold**, *italic*, `code`"
                  />
                ) : (
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={stagedFiles.length > 0 ? "Add a message with your files..." : "Ask me anything! I remember our conversation and have infinite capabilities..."}
                    disabled={isLoading}
                    className="w-full border-0 bg-transparent focus:ring-0 text-gray-900 placeholder-gray-500 outline-none text-lg"
                  />
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={(!message.trim() && stagedFiles.length === 0) || isLoading}
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            <strong>CrazeGPT</strong> • Created by CraftingCrazeGaming • Model: {selectedModel.replace('-', ' ').toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
