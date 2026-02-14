import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { generateComparisonData } from '../services/geminiService';
import { Loader2, Save, Download, Check, Share2, AlertCircle } from 'lucide-react';
import { userService } from '../services/userService';
import html2canvas from 'html2canvas';

const ComparisonPage: React.FC = () => {
  const [topicA, setTopicA] = useState('');
  const [topicB, setTopicB] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  
  // Action states
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!topicA || !topicB) return;
    setLoading(true);
    setData(null);
    setAnalysis('');
    setSaved(false);
    setError('');

    const result = await generateComparisonData(topicA, topicB);
    if (result && result.data) {
      setData(result.data);
      setAnalysis(result.analysis || "Comparison complete.");
    } else {
      setError("Could not generate comparison. Please try different topics.");
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!data) return;
    userService.saveDecision({
        id: Date.now().toString(),
        title: `${topicA} vs ${topicB}`,
        date: new Date().toLocaleDateString(),
        category: 'Other',
        summary: analysis.substring(0, 100) + '...',
        fullDetails: analysis,
        image: '' 
    });
    setSaved(true);
  };

  const handleDownload = async () => {
      setDownloading(true);
      const element = document.getElementById('comparison-card');
      if (element) {
          try {
              const canvas = await html2canvas(element, {
                  useCORS: true,
                  backgroundColor: '#0f172a', // Match app background
                  scale: 2 // Higher quality
              });
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = `DecideForMe-${topicA}-vs-${topicB}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } catch (e) {
              console.error("Download error:", e);
              alert("Failed to download image.");
          }
      }
      setDownloading(false);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 mb-4 tracking-tight">
          Battle Mode
        </h1>
        <p className="text-gray-400 text-lg">Enter two options and let AI breakdown the stats.</p>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl mb-12 max-w-3xl mx-auto border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center relative">
          <div className="w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Challenger 1</label>
            <input 
                className="w-full bg-surface border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition shadow-inner"
                placeholder="e.g. Nike Dunks"
                value={topicA}
                onChange={(e) => setTopicA(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-center w-12 h-12 bg-white/5 rounded-full border border-white/10 shrink-0 font-black text-gray-400 italic mt-6">
             VS
          </div>

          <div className="w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Challenger 2</label>
            <input 
                className="w-full bg-surface border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition shadow-inner"
                placeholder="e.g. Adidas Samba"
                value={topicB}
                onChange={(e) => setTopicB(e.target.value)}
            />
          </div>
        </div>

        {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <button 
          onClick={handleCompare}
          disabled={loading || !topicA || !topicB}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-teal-500 hover:brightness-110 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 className="animate-spin" /> crunching numbers...</> : "Start Comparison"}
        </button>
      </div>

      {/* Results Section */}
      {data && (
        <div id="comparison-card" className="animate-fade-in-up">
           
           {/* Actions Toolbar (Hidden from capture if preferred, but useful context) */}
           <div className="flex justify-end gap-2 mb-4" data-html2canvas-ignore="true">
               <button 
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${saved ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
               >
                   {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save Result</>}
               </button>
               <button 
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-gray-300 hover:bg-white/10 transition"
               >
                   {downloading ? <Loader2 size={16} className="animate-spin" /> : <><Download size={16} /> Download Card</>}
               </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart Column */}
                <div className="glass-panel p-6 rounded-3xl h-[450px] border border-white/5 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Share2 size={120} />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-6 text-white relative z-10">Visual Stats</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: '600' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name={topicA} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                            <Radar name={topicB} dataKey="B" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#374151', color: '#fff', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Analysis Column */}
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                        <span className="text-secondary">AI</span> Verdict
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg mb-8">
                    {analysis}
                    </p>
                    
                    <div className="space-y-4 bg-surface/50 p-4 rounded-2xl border border-white/5">
                        {data.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                <span className="text-gray-400 font-medium">{item.subject}</span>
                                <div className="flex gap-4 text-sm font-bold">
                                    <span className={item.A > item.B ? "text-blue-400" : "text-gray-600"}>{item.A}</span>
                                    <span className="text-gray-700">|</span>
                                    <span className={item.B > item.A ? "text-teal-400" : "text-gray-600"}>{item.B}</span>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end gap-4 text-xs font-bold pt-2 uppercase tracking-wide">
                            <span className="text-blue-400">{topicA}</span>
                            <span className="text-teal-400">{topicB}</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Powered by DecideForMe AI</p>
                    </div>
                </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;