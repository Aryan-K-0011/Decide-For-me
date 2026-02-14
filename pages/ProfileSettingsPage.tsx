import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User, AppRoutes } from '../types';
import { Save, User as UserIcon, Camera, Sparkles, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';

const ProfileSettingsPage: React.FC = () => {
  const [user, setUser] = useState<User>(userService.getUser());
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [quizVibe, setQuizVibe] = useState<string>('');
  
  // Feedback state
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackType, setFeedbackType] = useState<'Feedback' | 'Bug Report'>('Feedback');
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const savedVibe = localStorage.getItem('user_vibe');
    if (savedVibe) setQuizVibe(savedVibe);
  }, []);

  const handleChange = (field: keyof User, value: any) => {
     setUser(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: string) => {
     setUser(prev => ({
        ...prev,
        preferences: {
            ...prev.preferences!,
            [field]: value
        }
     }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
        userService.updateUser(user);
        setIsSaving(false);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
      e.preventDefault();
      if(!feedbackMsg.trim()) return;
      
      storageService.addFeedback(user.username, feedbackMsg, feedbackType);
      setFeedbackSent(true);
      setFeedbackMsg('');
      setTimeout(() => setFeedbackSent(false), 3000);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
      <p className="text-gray-400 mb-8">Manage your personal details and decision preferences.</p>

      {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-center animate-fade-in-up">
              {message}
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
         {/* Left Column: Avatar & Quiz */}
         <div className="space-y-6">
             <div className="glass-panel p-6 rounded-3xl flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-surface mb-4 border-4 border-primary/30 group">
                   {user.avatar ? (
                       <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-500">
                           <UserIcon size={48} />
                       </div>
                   )}
                   <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                       <Camera className="text-white" size={32} />
                       <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                   </label>
                </div>
                <p className="text-gray-400 text-sm mb-1">Tap to change photo</p>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-primary text-sm">{user.username}</p>
             </div>

             {/* Quiz Integration */}
             <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="text-secondary" size={18} /> Personality Vibe
                </h3>
                {quizVibe ? (
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 px-4 rounded-xl inline-block mb-3 text-lg">
                            {quizVibe}
                        </div>
                        <p className="text-gray-400 text-xs mb-3">Based on your recent quiz results.</p>
                        <Link to={AppRoutes.QUIZ} className="text-sm text-primary hover:text-white transition underline">
                            Retake Quiz
                        </Link>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-3">No quiz result yet.</p>
                        <Link to={AppRoutes.QUIZ} className="block w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-sm transition">
                            Take Quiz
                        </Link>
                    </div>
                )}
             </div>

             {/* Feedback Form */}
             <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="text-blue-400" size={18} /> Send Feedback
                </h3>
                {feedbackSent ? (
                    <p className="text-green-400 text-sm text-center py-4">Thanks! Your feedback was sent to Admin.</p>
                ) : (
                    <form onSubmit={handleSendFeedback} className="space-y-3">
                        <select 
                            value={feedbackType}
                            onChange={(e) => setFeedbackType(e.target.value as any)}
                            className="w-full bg-dark border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        >
                            <option>Feedback</option>
                            <option>Bug Report</option>
                        </select>
                        <textarea 
                            value={feedbackMsg}
                            onChange={(e) => setFeedbackMsg(e.target.value)}
                            placeholder="Tell us what you think..."
                            className="w-full bg-dark border border-gray-700 rounded-lg px-3 py-2 text-sm text-white h-24 resize-none focus:outline-none focus:border-blue-500"
                        />
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition">
                            Send to Admin
                        </button>
                    </form>
                )}
             </div>
         </div>

         {/* Right Column: Form Fields */}
         <div className="md:col-span-2 glass-panel p-8 rounded-3xl">
             <form onSubmit={handleSave} className="space-y-8">
                {/* Personal Info */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            value={user.name} 
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                        <input 
                            type="text" 
                            value={user.username} 
                            onChange={e => handleChange('username', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        />
                        </div>
                        <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={user.email} 
                            onChange={e => handleChange('email', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                        <input 
                            type="number" 
                            value={user.age || ''} 
                            onChange={e => handleChange('age', e.target.value)}
                            placeholder="e.g. 24"
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
                        <select 
                            value={user.gender || ''}
                            onChange={e => handleChange('gender', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        </div>
                    </div>
                </div>

                {/* Decision Preferences */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Decision Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Style Preference</label>
                        <select 
                            value={user.preferences?.style}
                            onChange={e => handlePreferenceChange('style', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        >
                            <option>Casual</option>
                            <option>Formal</option>
                            <option>Streetwear</option>
                            <option>Vintage</option>
                            <option>Minimalist</option>
                            <option>Bohemian</option>
                            <option>Chic</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Budget Range</label>
                        <select 
                            value={user.preferences?.budget}
                            onChange={e => handlePreferenceChange('budget', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        >
                            <option>Low ($)</option>
                            <option>Medium ($$)</option>
                            <option>High ($$$)</option>
                            <option>Luxury ($$$$)</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Food Preference</label>
                        <select 
                            value={user.preferences?.food}
                            onChange={e => handlePreferenceChange('food', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        >
                            <option>Everything</option>
                            <option>Vegetarian</option>
                            <option>Vegan</option>
                            <option>Keto</option>
                            <option>Halal</option>
                            <option>Gluten-Free</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Travel Style</label>
                        <select 
                            value={user.preferences?.travel}
                            onChange={e => handlePreferenceChange('travel', e.target.value)}
                            className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        >
                            <option>Relaxing (Beach/Spa)</option>
                            <option>Adventure (Hiking/Sports)</option>
                            <option>City Break (Culture/Food)</option>
                            <option>Luxury (Resorts)</option>
                            <option>Backpacking</option>
                        </select>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <Save size={20} /> {isSaving ? 'Saving Changes...' : 'Save Profile'}
                </button>
             </form>
         </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;