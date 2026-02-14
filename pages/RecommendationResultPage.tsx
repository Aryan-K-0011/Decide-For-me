import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { AppRoutes } from '../types';
import { Share2, Bookmark, MessageCircle, Check } from 'lucide-react';
import { userService } from '../services/userService';

const RecommendationResultPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { image: string; analysis: string } | null;
  const [saved, setSaved] = useState(false);

  if (!state) return <Navigate to={AppRoutes.UPLOAD_PHOTO} />;

  const handleSave = () => {
    userService.saveDecision({
        id: Date.now().toString(),
        title: 'Photo Analysis',
        date: new Date().toLocaleDateString(),
        category: 'Other',
        summary: state.analysis.substring(0, 100) + '...',
        fullDetails: state.analysis,
        image: state.image
    });
    setSaved(true);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         {/* Image Side */}
         <div className="flex flex-col gap-4">
             <div className="glass-panel p-4 rounded-3xl border border-white/10">
                <img src={state.image} alt="Analyzed" className="w-full h-auto rounded-2xl object-cover" />
             </div>
             <div className="flex gap-4">
                <button className="flex-1 glass-panel py-3 rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2 text-white">
                   <Share2 size={18} /> Share
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex-1 glass-panel py-3 rounded-xl transition flex items-center justify-center gap-2 text-white ${saved ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'hover:bg-white/10'}`}
                >
                   {saved ? <><Check size={18} /> Saved</> : <><Bookmark size={18} /> Save</>}
                </button>
             </div>
         </div>

         {/* Content Side */}
         <div>
            <h1 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
               <span className="text-secondary">AI</span> Verdict
            </h1>
            
            <div className="glass-panel p-8 rounded-3xl mb-8 leading-relaxed text-gray-200 whitespace-pre-wrap text-lg">
               {state.analysis}
            </div>

            <div className="bg-surface/50 border border-gray-700 rounded-2xl p-6">
               <h3 className="font-bold text-white mb-2">Want to discuss more?</h3>
               <p className="text-gray-400 text-sm mb-4">You can take this conversation to the chat for more details.</p>
               <Link to={AppRoutes.CHAT} className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition">
                  Go to Chat <MessageCircle size={18} />
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RecommendationResultPage;
