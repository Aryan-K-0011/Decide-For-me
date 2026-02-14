import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizResult } from '../types';
import { AppRoutes } from '../types';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dynamic questions
    setQuestions(storageService.getQuizQuestions());
  }, []);

  const handleOptionClick = (optionVibe: string) => {
    const newAnswers = [...answers, optionVibe];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: string[]) => {
    const counts: Record<string, number> = {};
    finalAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    
    // Safety check if counts is empty
    let topVibe = "Classy";
    if (Object.keys(counts).length > 0) {
        topVibe = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }
    
    let description = "";
    let color = "";

    switch(topVibe) {
      case "Classy":
        description = "You love timeless elegance. Less is more for you.";
        color = "from-amber-200 to-amber-500";
        break;
      case "Trendy":
        description = "You live for the moment. Bold choices define you.";
        color = "from-fuchsia-500 to-purple-600";
        break;
      case "Grounded":
        description = "You value comfort and authenticity. Nature is your muse.";
        color = "from-emerald-400 to-teal-600";
        break;
      case "Creative":
        description = "You see the world differently. Unique and colorful.";
        color = "from-orange-400 to-pink-500";
        break;
      default:
        description = "You have a unique style that blends everything!";
        color = "from-blue-400 to-purple-500";
    }

    const result: QuizResult = { vibe: topVibe, description, color };
    localStorage.setItem('user_vibe', topVibe);
    localStorage.setItem('quizResult', JSON.stringify(result));
    
    navigate(AppRoutes.QUIZ_RESULT);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const question = questions[currentStep];

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-2 rounded-full mb-8">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((currentStep) / questions.length) * 100}%` }}
          />
        </div>

        <div className="mb-8">
          <span className="text-primary font-bold text-sm uppercase tracking-wide">Question {currentStep + 1} of {questions.length}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{question.question}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt.vibe)}
              className="glass-panel p-6 rounded-2xl text-left hover:bg-white/10 hover:border-primary/50 transition duration-200 border border-transparent group"
            >
              <span className="text-xl font-medium text-gray-200 group-hover:text-white">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
