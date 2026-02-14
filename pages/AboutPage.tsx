import React from 'react';
import { Sparkles, Users, Zap, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary mb-6">
          About DecideForMe
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          We are the digital cure for your daily "I don't know what to do" moments.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl mb-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
           <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
             <Zap className="text-yellow-400" /> Our Mission
           </h2>
           <p className="text-gray-300 leading-relaxed text-lg">
             We built DecideForMe to help you make fast, confident, and fun decisions. 
             Whether it's choosing a travel destination, picking an outfit, or deciding what to eat, 
             our AI assistant acts as your smart best friend who knows your vibe.
           </p>
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-gradient-to-tr from-primary to-secondary rounded-full blur-3xl opacity-50 absolute"></div>
            <Sparkles size={120} className="text-white relative z-10" />
        </div>
      </div>

      {/* Target Audience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: <Users className="text-blue-400" size={32} />, title: "Gen Z & Millennials", desc: "For the trendsetters and digital natives who value speed and style." },
          { icon: <Heart className="text-pink-400" size={32} />, title: "The Overthinkers", desc: "For those who spend 30 minutes staring at a menu. We got you." },
          { icon: <Sparkles className="text-primary" size={32} />, title: "Style Enthusiasts", desc: "For fashion and lifestyle lovers who want tailored advice." }
        ].map((item, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition">
             <div className="bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
             </div>
             <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
             <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Brand Values */}
      <div className="glass-panel p-8 rounded-3xl text-center">
         <h2 className="text-2xl font-bold text-white mb-8">Our Core Vibe</h2>
         <div className="flex flex-wrap justify-center gap-4">
            {['Trendy', 'Interactive', 'Minimal', 'Modern', 'Premium', 'Fun'].map((tag, i) => (
              <span key={i} className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-gray-200 font-medium">
                {tag}
              </span>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AboutPage;
