import React, { useEffect, useState } from 'react';
import { SavedDecision, User, AppRoutes, QuizResult } from '../types';
import { Bookmark, User as UserIcon, Settings, Clock, ArrowRight, Trash2, MessageCircle, Compass, Sparkles, ChartPie, Star } from 'lucide-react';
import { userService } from '../services/userService';
import { storageService } from '../services/storageService';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User>(userService.getUser());
  const [savedItems, setSavedItems] = useState<SavedDecision[]>([]);
  const [spinHistory, setSpinHistory] = useState<{ result: string, date: string }[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [recentChats, setRecentChats] = useState<any[]>([]);

  useEffect(() => {
    // Load initial data
    setUser(userService.getUser());
    setSavedItems(userService.getSavedDecisions().slice(0, 4));
    setSpinHistory(userService.getSpinHistory());
    setRecentChats(storageService.getChatSessions(userService.getUser().username).slice(0, 3));
    
    const storedQuiz = localStorage.getItem('quizResult');
    if (storedQuiz) setQuizResult(JSON.parse(storedQuiz));

    // Listen for updates
    const handleDataChange = () => {
        setSavedItems(userService.getSavedDecisions().slice(0, 4));
        setSpinHistory(userService.getSpinHistory());
        setUser(userService.getUser());
    };

    const handleChatSync = () => {
        setRecentChats(storageService.getChatSessions(userService.getUser().username).slice(0, 3));
    };
    
    window.addEventListener('dataChange', handleDataChange);
    window.addEventListener('userChange', handleDataChange);
    window.addEventListener('sync-chats', handleChatSync);
    
    return () => {
        window.removeEventListener('dataChange', handleDataChange);
        window.removeEventListener('userChange', handleDataChange);
        window.removeEventListener('sync-chats', handleChatSync);
    };
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    userService.deleteDecision(id);
  };

  // Generate Suggestions based on preferences
  const getSuggestions = () => {
    const suggestions = [];
    if (user.preferences?.style === 'Streetwear') {
        suggestions.push({ title: 'New Sneaker Drops', category: 'Style', icon: <Sparkles size={16} /> });
    } else {
        suggestions.push({ title: 'Minimalist Wardrobe', category: 'Style', icon: <Sparkles size={16} /> });
    }

    if (user.preferences?.travel === 'Relaxing') {
        suggestions.push({ title: 'Top 5 Spas', category: 'Travel', icon: <Compass size={16} /> });
    } else {
        suggestions.push({ title: 'Hiking Trails', category: 'Travel', icon: <Compass size={16} /> });
    }
    
    // Default suggestion
    suggestions.push({ title: 'Trending Food Spots', category: 'Food', icon: <Star size={16} /> });

    return suggestions;
  };

  return (
    <div className="pt-24 pb-12 min-h-screen px-4 max-w-7xl mx-auto">
      
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white mb-1">Hello, {user.name.split(' ')[0]} 👋</h1>
           <p className="text-gray-400">Ready to make some decisions today?</p>
        </div>
        <Link to={AppRoutes.PROFILE_SETTINGS} className="glass-panel px-4 py-2 rounded-full text-sm font-bold text-white hover:bg-white/10 transition flex items-center gap-2">
           <Settings size={16} /> Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Personality Quiz Result Banner */}
            {quizResult ? (
                <div className={`p-6 rounded-3xl bg-gradient-to-r ${quizResult.color} relative overflow-hidden shadow-lg`}>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <p className="text-white/80 font-bold text-xs uppercase tracking-wider mb-1">Your Vibe</p>
                            <h2 className="text-3xl font-extrabold text-white mb-2">{quizResult.vibe}</h2>
                            <p className="text-white/90 text-sm max-w-md">{quizResult.description}</p>
                        </div>
                        <div className="hidden sm:block bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                            <Sparkles className="text-white w-8 h-8" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-panel p-6 rounded-3xl flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Discover Your Vibe</h2>
                        <p className="text-gray-400 text-sm">Take the quiz to personalize your AI.</p>
                    </div>
                    <Link to={AppRoutes.QUIZ} className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:brightness-110 transition">
                        Take Quiz
                    </Link>
                </div>
            )}

            {/* Suggested For You */}
            <div>
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <Star className="text-yellow-400" size={18} /> Suggested For You
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {getSuggestions().map((item, idx) => (
                      <Link key={idx} to={AppRoutes.CHAT} className="glass-panel p-4 rounded-2xl hover:bg-white/5 transition group border border-white/5 hover:border-primary/30">
                          <div className="flex justify-between items-start mb-3">
                              <span className="text-xs font-bold text-gray-500 bg-black/20 px-2 py-1 rounded">{item.category}</span>
                              <div className="text-primary group-hover:scale-110 transition">{item.icon}</div>
                          </div>
                          <h4 className="font-bold text-white">{item.title}</h4>
                      </Link>
                  ))}
               </div>
            </div>

            {/* Saved Recommendations */}
            <div>
               <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Bookmark className="text-secondary" size={18} /> Saved Decisions
                   </h3>
                   <Link to={AppRoutes.SAVED_RESULTS} className="text-xs text-gray-400 hover:text-white transition">View All</Link>
               </div>
               
               {savedItems.length === 0 ? (
                  <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-gray-700">
                      <p className="text-gray-500 text-sm">No saved items yet.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedItems.map(item => (
                          <div key={item.id} className="glass-panel p-5 rounded-2xl relative group hover:border-white/20 transition">
                              <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-white truncate pr-6">{item.title}</h4>
                                  <button onClick={(e) => handleDelete(e, item.id)} className="text-gray-600 hover:text-red-400">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                              <p className="text-gray-400 text-xs line-clamp-2 mb-3 h-8">{item.summary}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock size={12} /> {item.date}
                              </div>
                          </div>
                      ))}
                  </div>
               )}
            </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
            
            {/* Profile Mini Card */}
            <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
               <div className="w-14 h-14 rounded-full bg-surface overflow-hidden border-2 border-primary/20">
                  {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><UserIcon /></div>
                  )}
               </div>
               <div>
                   <h3 className="font-bold text-white">{user.name}</h3>
                   <p className="text-xs text-gray-400">{user.username}</p>
               </div>
            </div>

            {/* Recent Chats */}
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageCircle className="text-blue-400" size={18} /> Recent Chats
                </h3>
                <div className="space-y-4">
                    {recentChats.length === 0 ? (
                        <p className="text-xs text-gray-500">No chat history yet.</p>
                    ) : recentChats.map(chat => (
                        <div key={chat.id} className="flex items-center justify-between pb-3 border-b border-gray-700 last:border-0 last:pb-0">
                            <div>
                                <p className="text-sm font-bold text-white truncate max-w-[150px]">{chat.topic}</p>
                                <p className="text-xs text-gray-500">{chat.time}</p>
                            </div>
                            <Link to={`${AppRoutes.CHAT}?id=${chat.id}`} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-300">
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))}
                    <Link to={AppRoutes.CHAT} className="block w-full text-center py-2 text-sm font-bold text-primary hover:text-white transition mt-2">
                        + New Chat
                    </Link>
                </div>
            </div>

            {/* Spin Wheel History */}
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ChartPie className="text-green-400" size={18} /> Spin History
                </h3>
                {spinHistory.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-xs mb-3">No spins yet.</p>
                        <Link to={AppRoutes.SPIN} className="text-xs font-bold text-green-400 hover:text-green-300">Spin Now</Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {spinHistory.map((spin, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-white font-medium">{spin.result}</span>
                                <span className="text-gray-500 text-xs">{spin.date}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;