import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, X, ChevronDown } from 'lucide-react';
import { generateDecisionResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { storageService } from '../services/storageService';
import { userService } from '../services/userService';
import { useSearchParams } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('General');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');

  const categories = ['General', 'Outfit', 'Food', 'Travel', 'Shopping'];

  useEffect(() => {
      // Load specific chat session if ID provided
      if (chatId) {
          const session = storageService.getChatSessionById(chatId);
          if (session) {
              setMessages(session.messages);
              // Try to infer category from stored topic or default
              return;
          }
      }

      // Default welcome
      setMessages([{
          id: 'welcome',
          role: 'model',
          text: "Hey! I'm your AI decision assistant. Need help with an outfit, dinner plans, or a trip? Select a category or just ask away! ✨",
          timestamp: Date.now()
      }]);
  }, [chatId]);

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

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const user = userService.getUser();
    const currentInput = input;
    
    // Use manually selected category
    const cat = selectedCategory;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    
    const imageToSend = selectedImage; 
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      // Pass category to AI
      const responseText = await generateDecisionResponse(newUserMessage.text, messages, imageToSend || undefined, cat);
      
      const newBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessages, newBotMessage];
      setMessages(finalMessages);

      // Save Session
      storageService.saveChatSession({
          id: chatId || Date.now().toString(),
          username: user.username,
          topic: currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : ''),
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          messages: finalMessages
      });

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
      {/* Header & Category Select */}
      <div className="mb-2 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Decision Chat</h2>
        
        {/* Category Selector */}
        <div className="flex justify-center gap-2 flex-wrap mb-2">
           {categories.map(c => (
               <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                      selectedCategory === c 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
               >
                   {c}
               </button>
           ))}
        </div>
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
            placeholder={`Ask about ${selectedCategory}...`}
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