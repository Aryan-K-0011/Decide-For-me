import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../types';
import { authService } from '../../services/authService';
import { ShieldCheck, Lock } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock credential check
    if (username === 'admin' && password === 'admin123') {
      authService.adminLogin();
      navigate(AppRoutes.ADMIN_DASHBOARD);
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="glass-panel p-10 rounded-3xl w-full max-w-md border border-white/10 relative z-10">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <ShieldCheck className="text-primary w-8 h-8" />
           </div>
           <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
           <p className="text-gray-400 text-sm">Restricted Access Only</p>
        </div>

        {error && (
           <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
           </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
             <input 
               type="text" 
               value={username}
               onChange={e => setUsername(e.target.value)}
               className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
               placeholder="Enter admin username"
             />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
             <input 
               type="password" 
               value={password}
               onChange={e => setPassword(e.target.value)}
               className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
               placeholder="••••••••"
             />
           </div>
           <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition mt-2 flex items-center justify-center gap-2">
              <Lock size={16} /> Access Panel
           </button>
        </form>

        <div className="mt-8 text-center">
           <a href="/" className="text-gray-500 hover:text-white text-sm">Return to Website</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
