import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { generateComparisonData } from '../services/geminiService';
import { Loader2 } from 'lucide-react';

const ComparisonPage: React.FC = () => {
  const [topicA, setTopicA] = useState('');
  const [topicB, setTopicB] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const handleCompare = async () => {
    if (!topicA || !topicB) return;
    setLoading(true);
    setData(null);
    setAnalysis('');

    const result = await generateComparisonData(topicA, topicB);
    if (result) {
      setData(result.data);
      setAnalysis(result.analysis);
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-8 min-h-screen px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 mb-4">
          Battle Mode
        </h1>
        <p className="text-gray-400">Enter two options and let AI breakdown the stats.</p>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-6 rounded-3xl mb-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input 
            className="w-full bg-surface border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Option A (e.g. Nike Dunks)"
            value={topicA}
            onChange={(e) => setTopicA(e.target.value)}
          />
          <span className="font-bold text-gray-500 text-xl">VS</span>
          <input 
            className="w-full bg-surface border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Option B (e.g. Adidas Samba)"
            value={topicB}
            onChange={(e) => setTopicB(e.target.value)}
          />
        </div>
        <button 
          onClick={handleCompare}
          disabled={loading || !topicA || !topicB}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2"
        >
          {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : "Compare Now"}
        </button>
      </div>

      {/* Results Section */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
          <div className="glass-panel p-6 rounded-3xl h-96">
            <h3 className="text-xl font-bold text-center mb-4 text-white">Visual Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={topicA} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Radar name={topicB} dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.5} />
                <Legend />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4 text-white">AI Verdict</h3>
            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              {analysis}
            </p>
            <div className="space-y-4">
               {data.map((item: any, idx: number) => (
                   <div key={idx} className="flex items-center justify-between border-b border-gray-700 pb-2">
                       <span className="text-gray-400">{item.subject}</span>
                       <div className="flex gap-4 text-sm font-bold">
                           <span className={item.A > item.B ? "text-primary" : "text-gray-500"}>{topicA}: {item.A}</span>
                           <span className={item.B > item.A ? "text-secondary" : "text-gray-500"}>{topicB}: {item.B}</span>
                       </div>
                   </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
