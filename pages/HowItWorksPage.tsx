import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Camera, ChartBar, CircleCheck, ArrowRight } from 'lucide-react';
import { AppRoutes } from '../types';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Ask or Upload",
      desc: "Chat with our AI about your dilemma or upload a photo for visual analysis.",
      icon: <MessageCircle size={28} className="text-primary" />,
      link: AppRoutes.CHAT,
      linkText: "Start Chatting"
    },
    {
      num: "02",
      title: "Get Analyzed",
      desc: "Our AI considers your style, budget, and mood to provide personalized options.",
      icon: <Camera size={28} className="text-secondary" />,
      link: AppRoutes.QUIZ,
      linkText: "Take Quiz First"
    },
    {
      num: "03",
      title: "Compare & Decide",
      desc: "Confused between two? Use the Comparison Graph to see the logical winner.",
      icon: <ChartBar size={28} className="text-blue-400" />,
      link: AppRoutes.COMPARE,
      linkText: "Compare Now"
    },
    {
      num: "04",
      title: "Save Your Choice",
      desc: "Save the best recommendations to your profile for future reference.",
      icon: <CircleCheck size={28} className="text-green-400" />,
      link: AppRoutes.LOGIN,
      linkText: "Create Profile"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-secondary via-pink-400 to-primary mb-6">
          How It Works
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          From confusion to confidence in 4 simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Connecting Line for Desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent -translate-x-1/2"></div>

        {steps.map((step, idx) => (
          <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? 'md:justify-end md:pr-12 md:text-right' : 'md:justify-start md:pl-12 md:text-left'} mb-12 md:mb-0`}>
             
             {/* Center Dot */}
             <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-surface border-4 border-dark rounded-full items-center justify-center z-10 shadow-xl">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
             </div>

             <div className={`glass-panel p-8 rounded-3xl max-w-md w-full hover:border-primary/30 transition duration-300 group`}>
                <div className={`flex items-center gap-4 mb-4 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        {step.icon}
                    </div>
                    <span className="text-5xl font-black text-white/5">{step.num}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 mb-6">{step.desc}</p>
                
                <Link to={step.link} className={`inline-flex items-center gap-2 text-primary hover:text-white font-bold transition ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                   {step.linkText} <ArrowRight size={18} />
                </Link>
             </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
         <Link to={AppRoutes.CHAT} className="bg-gradient-to-r from-primary to-secondary px-10 py-4 rounded-full text-white font-bold text-xl shadow-lg hover:scale-105 transition">
            Start Deciding Now
         </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;