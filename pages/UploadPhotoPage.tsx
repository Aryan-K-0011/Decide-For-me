import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Sparkles, User, Shirt, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../types';
import { generateDecisionResponse } from '../services/geminiService';

type PhotoType = 'Outfit' | 'Face' | 'Inspiration' | 'General';

const UploadPhotoPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<PhotoType>('Outfit');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      let promptPrefix = "";
      switch (photoType) {
        case 'Face':
            promptPrefix = "Analyze this face photo. Determine the face shape and skin tone. Suggest suitable hairstyles, glasses, jewelry, or makeup looks that would enhance these features. Be kind, objective, and specific.";
            break;
        case 'Outfit':
            promptPrefix = "Analyze this outfit photo. Rate the style, color coordination, and fit out of 10. Give a 'Vibe Check'. Suggest specific improvements (shoes, accessories, layers) to elevate the look.";
            break;
        case 'Inspiration':
            promptPrefix = "Analyze this inspiration/reference photo. Break down the key elements (colors, textures, fit) that make this look work. Suggest how I can recreate this vibe within a reasonable budget.";
            break;
        default:
            promptPrefix = "Analyze this image. Identify what it is and give a rating, honest opinion, and specific recommendations to improve or choose better.";
      }

      const prompt = `${promptPrefix} ${context ? `\nUser Context: "${context}"` : ''}`;

      // Reusing the chat service logic for simplicity, passing empty history
      const analysis = await generateDecisionResponse(prompt, [], selectedImage);
      
      navigate(AppRoutes.RECOMMENDATION_RESULT, { state: { image: selectedImage, analysis } });
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const photoTypes = [
      { id: 'Outfit', label: 'Outfit Check', icon: <Shirt size={20} />, desc: 'Rate my fit & suggest improvements' },
      { id: 'Face', label: 'Face Analysis', icon: <User size={20} />, desc: 'Hairstyle & accessory suggestions' },
      { id: 'Inspiration', label: 'Inspo Match', icon: <Lightbulb size={20} />, desc: 'How to recreate this vibe' },
  ];

  return (
    <div className="pt-24 min-h-screen px-4 flex items-center justify-center pb-12">
      <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-4xl border border-white/10">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary mb-2">Photo Analysis</h1>
           <p className="text-gray-400">Upload a photo to get personalized AI advice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Upload */}
            <div className="order-2 md:order-1">
                <label className="block text-gray-400 text-sm mb-3 font-bold uppercase tracking-wider">1. Upload Photo</label>
                <div className="mb-6">
                {!selectedImage ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-600 rounded-2xl h-64 md:h-80 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-white/5 transition group"
                    >
                        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <Upload className="text-gray-400 group-hover:text-primary" size={32} />
                        </div>
                        <p className="text-gray-300 font-medium">Click to Upload</p>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG supported</p>
                    </div>
                ) : (
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-700 bg-black/50 flex justify-center">
                        <img src={selectedImage} alt="Preview" className="object-contain h-full w-full" />
                        <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-red-500/80 p-2 rounded-full text-white transition backdrop-blur-sm"
                        >
                        <X size={20} />
                        </button>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                </div>
            </div>

            {/* Right Column: Settings */}
            <div className="order-1 md:order-2 space-y-6">
                
                <div>
                    <label className="block text-gray-400 text-sm mb-3 font-bold uppercase tracking-wider">2. Select Photo Type</label>
                    <div className="grid grid-cols-1 gap-3">
                        {photoTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setPhotoType(type.id as PhotoType)}
                                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition ${
                                    photoType === type.id 
                                    ? 'bg-primary/20 border-primary text-white' 
                                    : 'bg-surface border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${photoType === type.id ? 'bg-primary text-white' : 'bg-white/10'}`}>
                                    {type.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{type.label}</h3>
                                    <p className="text-xs opacity-70">{type.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">3. Add Context (Optional)</label>
                    <textarea 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="E.g. Is this good for a summer wedding? Or what makeup goes with this?" 
                        className="w-full bg-surface border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none h-24 text-sm"
                    />
                </div>
            </div>
        </div>

        <div className="mt-8">
            <button 
            onClick={handleAnalyze}
            disabled={!selectedImage || loading}
            className="w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition flex items-center justify-center gap-2 text-lg"
            >
            {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><Sparkles size={24} /> Get AI Analysis</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoPage;
