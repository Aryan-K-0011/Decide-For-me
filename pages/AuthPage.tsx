import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../types';
import { authService } from '../services/authService';
import { Mail, Lock, User, ArrowLeft, CircleCheck } from 'lucide-react';

const AuthPage: React.FC<{ type: 'login' | 'signup' | 'forgot-password' }> = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(async () => {
      if (type === 'login') {
        const role = authService.login(email, password);
        if (role === 'admin') {
            navigate(AppRoutes.ADMIN_DASHBOARD);
        } else if (role === 'user') {
            navigate(AppRoutes.DASHBOARD);
        } else if (role === 'banned') {
            setError("Access Denied: Your account has been suspended by the administrator.");
            setIsLoading(false);
        } else {
            setError("Invalid credentials. Try 'admin'/'admin123' or sign up.");
            setIsLoading(false);
        }
      } else if (type === 'signup') {
        authService.signup(username, email, password);
        navigate(AppRoutes.DASHBOARD);
      } else if (type === 'forgot-password') {
        await authService.resetPassword(email);
        setResetSent(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  // Render Forgot Password Success State
  if (type === 'forgot-password' && resetSent) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-white/10 text-center animate-fade-in-up">
           <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
              <CircleCheck size={32} />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
           <p className="text-gray-400 mb-8">We have sent a password reset link to <span className="text-white font-medium">{email}</span>.</p>
           
           <Link to={AppRoutes.LOGIN} className="block w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition">
             Back to Login
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-white/10 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
           <h2 className="text-3xl font-bold text-white mb-2">
             {type === 'login' && 'Welcome Back'}
             {type === 'signup' && 'Join the Club'}
             {type === 'forgot-password' && 'Reset Password'}
           </h2>
           <p className="text-gray-400">
             {type === 'login' && 'Continue your decision streak.'}
             {type === 'signup' && 'Start making better choices today.'}
             {type === 'forgot-password' && 'Enter your email to get back in.'}
           </p>
        </div>

        {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Field (Signup Only) */}
          {type === 'signup' && (
             <div className="relative">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Username</label>
               <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input 
                   type="text" 
                   value={username}
                   onChange={e => setUsername(e.target.value)}
                   className="w-full bg-surface border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none transition" 
                   placeholder="@username" 
                   required 
                 />
               </div>
             </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                {type === 'login' ? 'Email or Username' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none transition" 
                placeholder={type === 'login' ? "hello@example.com or admin" : "hello@example.com"} 
                required
              />
            </div>
          </div>

          {/* Password Field (Login & Signup) */}
          {type !== 'forgot-password' && (
             <div className="relative">
               <div className="flex justify-between items-center mb-1 ml-1">
                 <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
                 {type === 'login' && (
                    <Link to={AppRoutes.FORGOT_PASSWORD} className="text-xs text-primary hover:text-white transition">Forgot?</Link>
                 )}
               </div>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input 
                   type="password" 
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full bg-surface border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none transition" 
                   placeholder="••••••••" 
                   required
                 />
               </div>
             </div>
          )}

          <button 
             disabled={isLoading}
             className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition mt-6 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (
                type === 'login' ? 'Log In' : 
                type === 'signup' ? 'Create Account' : 'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-6">
          {type === 'login' && (
            <>
              Don't have an account? <Link to={AppRoutes.SIGNUP} className="text-white hover:text-primary font-bold ml-1 transition">Sign Up</Link>
            </>
          )}
          {type === 'signup' && (
            <>
              Already have an account? <Link to={AppRoutes.LOGIN} className="text-white hover:text-primary font-bold ml-1 transition">Log In</Link>
            </>
          )}
          {type === 'forgot-password' && (
            <Link to={AppRoutes.LOGIN} className="flex items-center justify-center gap-2 text-white hover:text-primary font-bold transition">
               <ArrowLeft size={14} /> Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;