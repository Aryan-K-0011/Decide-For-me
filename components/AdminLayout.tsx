import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, MessageSquare, LogOut, Sparkles, Globe } from 'lucide-react';
import { AppRoutes } from '../types';
import { authService } from '../services/authService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.adminLogout();
    navigate(AppRoutes.LOGIN);
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: AppRoutes.ADMIN_DASHBOARD },
    { icon: <Users size={20} />, label: 'User Management', path: AppRoutes.ADMIN_USERS },
    { icon: <FileText size={20} />, label: 'Categories & Quiz', path: AppRoutes.ADMIN_CONTENT },
    { icon: <MessageSquare size={20} />, label: 'Feedback & Reports', path: AppRoutes.ADMIN_FEEDBACK },
  ];

  return (
    <div className="min-h-screen flex bg-dark text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 fixed h-full glass-panel border-r border-gray-700/50 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-700/50">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                 <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">Admin Panel</span>
           </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
           {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <Link 
                 key={item.path}
                 to={item.path}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                   isActive 
                     ? 'bg-primary text-white font-bold' 
                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
                 }`}
               >
                 {item.icon}
                 <span>{item.label}</span>
               </Link>
             );
           })}
        </nav>

        <div className="p-4 border-t border-gray-700/50 space-y-2">
           <Link 
             to={AppRoutes.DASHBOARD}
             className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-white/5 transition"
           >
             <Globe size={20} />
             <span>Back to Website</span>
           </Link>
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition"
           >
             <LogOut size={20} />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
