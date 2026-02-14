import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { generateDecisionResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { storageService } from '../services/storageService';
import { userService } from '../services/userService';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hey! I'm your AI decision assistant. Need help with an outfit, dinner plans, or a trip? Send a pic or just ask away! ✨",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const detectCategory = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('wear') || t.includes('dress') || t.includes('outfit')) return 'Outfit';
    if (t.includes('eat') || t.includes('food') || t.includes('restaurant')) return 'Food';
    if (t.includes('travel') || t.includes('trip') || t.includes('visit')) return 'Travel';
    return 'General';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const user = userService.getUser();
    const currentInput = input;
    const cat = detectCategory(currentInput);

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    
    // Keep reference to image for the API call, then clear it from UI state for next message
    const imageToSend = selectedImage; 
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const responseText = await generateDecisionResponse(newUserMessage.text, messages, imageToSend || undefined);
      
      const newBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newBotMessage]);

      // SYNC: Log activity for Admin
      storageService.addLog(user.username, cat, currentInput, 'Success');

    } catch (error) {
      console.error(error);
      storageService.addLog(user.username, cat, currentInput, 'Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-4 h-screen flex flex-col max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI Decision Chat</h2>
        <p className="text-gray-400 text-sm">Ask about Fashion, Food, Travel & Shopping</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto glass-panel rounded-2xl p-4 mb-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-surface border border-gray-700 text-gray-200 rounded-bl-none'
            }`}>
              {msg.image && (
                <img src={msg.image} alt="User upload" className="w-full max-w-xs rounded-lg mb-2 border border-white/20" />
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-gray-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              <span className="text-gray-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 relative">
        {selectedImage && (
          <div className="absolute bottom-full left-0 mb-2 p-2 glass-panel rounded-xl flex items-center gap-2">
            <img src={selectedImage} alt="Preview" className="w-12 h-12 rounded object-cover" />
            <button onClick={clearImage} className="text-red-400 hover:text-red-300">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-xl transition ${selectedImage ? 'text-secondary bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <ImageIcon size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500"
          />
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
