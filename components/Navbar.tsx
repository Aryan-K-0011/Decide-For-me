import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, User, LayoutDashboard, Settings, LogOut, Shield } from 'lucide-react';
import { AppRoutes } from '../types';
import { authService } from '../services/authService';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(authService.isAdminAuthenticated());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
        setIsLoggedIn(authService.isAuthenticated());
        setIsAdmin(authService.isAdminAuthenticated());
    };
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('adminAuthChange', handleAuthChange);

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('authChange', handleAuthChange);
        window.removeEventListener('adminAuthChange', handleAuthChange);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate(AppRoutes.HOME);
    setIsOpen(false);
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path ? "text-white font-bold bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/80 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to={AppRoutes.HOME} className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">DecideForMe</span>
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link to={AppRoutes.HOME} className={`${isActive(AppRoutes.HOME)} px-4 py-2 rounded-full text-sm transition-all`}>Home</Link>
              <Link to={AppRoutes.ABOUT} className={`${isActive(AppRoutes.ABOUT)} px-4 py-2 rounded-full text-sm transition-all`}>About</Link>
              <Link to={AppRoutes.HOW_IT_WORKS} className={`${isActive(AppRoutes.HOW_IT_WORKS)} px-4 py-2 rounded-full text-sm transition-all`}>How It Works</Link>
              
              {isLoggedIn && (
                <>
                  <div className="h-4 w-px bg-white/10 mx-2"></div>
                  <Link to={AppRoutes.CHAT} className={`${isActive(AppRoutes.CHAT)} px-4 py-2 rounded-full text-sm transition-all`}>AI Chat</Link>
                  <Link to={AppRoutes.QUIZ} className={`${isActive(AppRoutes.QUIZ)} px-4 py-2 rounded-full text-sm transition-all`}>Quiz</Link>
                  <Link to={AppRoutes.UPLOAD_PHOTO} className={`${isActive(AppRoutes.UPLOAD_PHOTO)} px-4 py-2 rounded-full text-sm transition-all`}>Upload</Link>
                  <Link to={AppRoutes.SPIN} className={`${isActive(AppRoutes.SPIN)} px-4 py-2 rounded-full text-sm transition-all`}>Spin</Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
             {isAdmin && (
                 <Link to={AppRoutes.ADMIN_DASHBOARD} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-full font-bold text-xs hover:bg-red-500/20 transition flex items-center gap-2">
                     <Shield size={14} /> Admin
                 </Link>
             )}
             
             {isLoggedIn ? (
               <>
                 <Link to={AppRoutes.DASHBOARD} className="p-2.5 bg-white/5 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition border border-white/5" title="Dashboard">
                    <LayoutDashboard size={20} />
                 </Link>
                 <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 transition">
                    <LogOut size={16} /> Logout
                 </button>
               </>
             ) : (
                <Link to={AppRoutes.LOGIN} className="bg-white text-dark px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5">
                    Login
                </Link>
             )}
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 absolute w-full">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link onClick={() => setIsOpen(false)} to={AppRoutes.HOME} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">Home</Link>
            <Link onClick={() => setIsOpen(false)} to={AppRoutes.ABOUT} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">About</Link>
            <Link onClick={() => setIsOpen(false)} to={AppRoutes.HOW_IT_WORKS} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">How It Works</Link>
            
            {isAdmin && (
                <Link onClick={() => setIsOpen(false)} to={AppRoutes.ADMIN_DASHBOARD} className="text-red-400 font-bold block px-3 py-3 rounded-xl text-base bg-red-500/10 border border-red-500/20 mb-2">
                    <Shield size={16} className="inline mr-2" /> Admin Panel
                </Link>
            )}

            {isLoggedIn && (
              <>
                <div className="h-px bg-white/10 my-2"></div>
                <Link onClick={() => setIsOpen(false)} to={AppRoutes.CHAT} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">AI Chat</Link>
                <Link onClick={() => setIsOpen(false)} to={AppRoutes.QUIZ} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">Quiz</Link>
                <Link onClick={() => setIsOpen(false)} to={AppRoutes.UPLOAD_PHOTO} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">Upload Photo</Link>
                <Link onClick={() => setIsOpen(false)} to={AppRoutes.SPIN} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">Spin Wheel</Link>
                <Link onClick={() => setIsOpen(false)} to={AppRoutes.COMPARE} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">Compare</Link>
                <Link onClick={() => setIsOpen(false)} to={AppRoutes.DASHBOARD} className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-3 rounded-xl text-base font-bold">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left text-red-400 hover:bg-red-500/10 block px-3 py-3 rounded-xl text-base font-bold">Logout</button>
              </>
            )}
            {!isLoggedIn && (
               <Link onClick={() => setIsOpen(false)} to={AppRoutes.LOGIN} className="text-dark bg-white block text-center px-3 py-3 rounded-xl text-base font-bold mt-4 shadow-lg">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
