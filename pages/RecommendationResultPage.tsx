import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { AppRoutes } from '../types';
import { Share2, Bookmark, MessageCircle, Check, Download, Loader2 } from 'lucide-react';
import { userService } from '../services/userService';
import html2canvas from 'html2canvas';

const RecommendationResultPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { image: string; analysis: string } | null;
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const handleShare = () => {
      // Copy analysis to clipboard
      navigator.clipboard.writeText(state.analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
      setDownloading(true);
      const element = document.getElementById('result-card');
      if (element) {
          try {
              const canvas = await html2canvas(element, {
                  useCORS: true,
                  backgroundColor: '#1e293b' // Matched background color
              });
              const data = canvas.toDataURL('image/jpg');
              const link = document.createElement('a');
              link.href = data;
              link.download = 'decideforme-result.jpg';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } catch (error) {
              console.error("Download failed", error);
              alert("Could not generate image. Please try again.");
          }
      }
      setDownloading(false);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12" id="result-card">
         {/* Image Side */}
         <div className="flex flex-col gap-4">
             <div className="glass-panel p-4 rounded-3xl border border-white/10">
                <img src={state.image} alt="Analyzed" className="w-full h-auto rounded-2xl object-cover" />
             </div>
             
             {/* Action Buttons */}
             <div className="flex gap-2 flex-wrap" data-html2canvas-ignore="true">
                <button 
                  onClick={handleShare}
                  className="flex-1 glass-panel py-3 rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2 text-white"
                >
                   {copied ? <><Check size={18} /> Copied</> : <><Share2 size={18} /> Share</>}
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 glass-panel py-3 rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2 text-white"
                >
                   {downloading ? <Loader2 className="animate-spin" size={18} /> : <><Download size={18} /> Save Card</>}
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
         <div className="glass-panel p-8 rounded-3xl h-fit border border-white/5">
            <h1 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
               <span className="text-secondary">AI</span> Verdict
            </h1>
            
            <div className="leading-relaxed text-gray-200 whitespace-pre-wrap text-lg mb-8">
               {state.analysis}
            </div>

            <div className="bg-surface/50 border border-gray-700 rounded-2xl p-6" data-html2canvas-ignore="true">
               <h3 className="font-bold text-white mb-2">Want to discuss more?</h3>
               <p className="text-gray-400 text-sm mb-4">You can take this conversation to the chat for more details.</p>
               <Link to={AppRoutes.CHAT} className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition">
                  Go to Chat <MessageCircle size={18} />
               </Link>
            </div>
            
            {/* Branding for Download */}
            <div className="mt-8 pt-4 border-t border-white/10 text-center text-gray-500 text-sm font-bold tracking-widest uppercase">
                DecideForMe AI
            </div>
         </div>
      </div>
    </div>
  );
};

export default RecommendationResultPage;