import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Compass, ChartPie, ArrowRight, Camera, Shirt, Plane, Utensils, ShoppingBag, Layers, Sparkles } from 'lucide-react';
import { AppRoutes } from '../types';
import { storageService } from '../services/storageService';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    setCategories(storageService.getCategories());
    
    // Listen for admin changes
    const handleSync = () => setCategories(storageService.getCategories());
    window.addEventListener('sync-content', handleSync);
    return () => window.removeEventListener('sync-content', handleSync);
  }, []);

  const getIcon = (name: string) => {
      const n = name.toLowerCase();
      if(n.includes('outfit') || n.includes('style')) return <Shirt size={28} />;
      if(n.includes('travel') || n.includes('trip')) return <Plane size={28} />;
      if(n.includes('food') || n.includes('din')) return <Utensils size={28} />;
      if(n.includes('shop')) return <ShoppingBag size={28} />;
      return <Layers size={28} />;
  };

  const getGradient = (index: number) => {
      const gradients = [
          "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
          "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30",
          "from-amber-500/20 to-orange-500/20 text-orange-400 border-orange-500/30",
          "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30"
      ];
      return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col relative overflow-hidden">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-24 lg:py-32">
        <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-8 backdrop-blur-md">
                <Sparkles size={16} className="text-yellow-400" />
                <span>The Gen Z AI Decision Assistant</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.1]">
              <span className="block text-white">Stop Overthinking.</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary animate-pulse-slow">
                Start Deciding.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed">
              Your personal AI bestie for fashion, food, travel, and vibes. 
              Upload a pic or just chat to get sorted instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to={AppRoutes.CHAT} className="group relative px-8 py-4 bg-white text-dark font-bold text-lg rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1">
                <span className="flex items-center gap-2">
                   Ask AI Now <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
              <Link to={AppRoutes.QUIZ} className="px-8 py-4 glass-panel hover:bg-white/10 text-white font-bold text-lg rounded-full transition-all transform hover:-translate-y-1 flex items-center gap-2">
                Check Your Vibe <ArrowRight size={20} />
              </Link>
            </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-16 max-w-7xl mx-auto w-full relative z-10">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">What are we solving today?</h2>
            <p className="text-gray-400">Select a category to jump straight in.</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const style = getGradient(idx);
              return (
                <Link key={cat.id} to={AppRoutes.CHAT} className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col items-center justify-center transition duration-300 group">
                   <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${style} flex items-center justify-center mb-6 shadow-inner`}>
                     <div className="text-white transform group-hover:scale-110 transition duration-300 drop-shadow-lg">
                        {getIcon(cat.name)}
                     </div>
                   </div>
                   <span className="font-bold text-white text-lg">{cat.name}</span>
                   <span className="text-xs text-gray-500 mt-1 font-medium">{cat.count} decisions made</span>
                </Link>
              );
            })}
         </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
                <h2 className="text-4xl font-bold text-white mb-2">Why DecideForMe?</h2>
                <p className="text-gray-400 text-lg">More than just a chatbot. It's a whole toolkit.</p>
            </div>
            <Link to={AppRoutes.ABOUT} className="text-primary font-bold hover:text-white transition flex items-center gap-1">
                Read our story <ArrowRight size={16} />
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: <MessageCircle className="w-8 h-8 text-white" />, 
              title: "AI Chatbot", 
              desc: "Instant advice on outfits, food, and more. Just chat like a friend.",
              link: AppRoutes.CHAT,
              color: "bg-blue-500"
            },
            { 
              icon: <Camera className="w-8 h-8 text-white" />, 
              title: "Photo Analysis", 
              desc: "Upload your fit or location pics for personalized ratings.",
              link: AppRoutes.UPLOAD_PHOTO,
              color: "bg-pink-500"
            },
            { 
              icon: <ChartPie className="w-8 h-8 text-white" />, 
              title: "Compare & Graph", 
              desc: "Can't pick between two? See the logical breakdown.",
              link: AppRoutes.COMPARE,
              color: "bg-purple-500"
            },
            { 
              icon: <Compass className="w-8 h-8 text-white" />, 
              title: "Spin The Wheel", 
              desc: "Leave it to fate with our fun interactive wheel.",
              link: AppRoutes.SPIN,
              color: "bg-green-500"
            }
          ].map((feature, idx) => (
            <Link key={idx} to={feature.link} className="glass-panel p-8 rounded-3xl hover:bg-white/5 transition duration-300 border border-white/5 hover:border-white/20 group relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${feature.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500`}></div>
              
              <div className={`mb-6 ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold text-white mb-1">DecideForMe</h4>
                <p className="text-gray-500 text-sm">Built for indecisive legends.</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
                <Link to={AppRoutes.ABOUT} className="hover:text-primary transition">About</Link>
                <Link to={AppRoutes.HOW_IT_WORKS} className="hover:text-primary transition">How It Works</Link>
                <Link to={AppRoutes.LOGIN} className="hover:text-primary transition">Login</Link>
            </div>
            <div className="text-gray-600 text-xs">
                &copy; 2024 DecideForMe Inc.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;