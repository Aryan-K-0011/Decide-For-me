import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes, QuizResult } from '../types';
import { ArrowLeft } from 'lucide-react';

const QuizResultPage: React.FC = () => {
  const [result, setResult] = useState<QuizResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('quizResult');
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      navigate(AppRoutes.QUIZ);
    }
  }, [navigate]);

  if (!result) return null;

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel max-w-lg w-full p-10 rounded-3xl text-center border border-white/10 animate-fade-in-up">
        <h2 className="text-gray-400 uppercase tracking-widest text-sm mb-4">Your Vibe Is</h2>
        <h1 className={`text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${result.color}`}>
          {result.vibe}
        </h1>
        <p className="text-xl text-gray-200 mb-10 leading-relaxed">{result.description}</p>
        
        <div className="flex flex-col gap-4">
          <Link to={AppRoutes.CHAT} className="w-full bg-white text-dark font-bold py-4 rounded-xl hover:bg-gray-100 transition shadow-lg shadow-white/20">
            Get AI Advice for {result.vibe} Style
          </Link>
          <Link to={AppRoutes.QUIZ} className="text-gray-400 hover:text-white transition">
            Retake Quiz
          </Link>
          <Link to={AppRoutes.HOME} className="flex items-center justify-center gap-2 text-primary font-bold mt-4">
             <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
