import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Search, Trash2, Ban, CheckCircle } from 'lucide-react';
import { storageService } from '../../services/storageService';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(storageService.getUsers());
    const handleSync = () => setUsers(storageService.getUsers());
    window.addEventListener('sync-users', handleSync);
    return () => window.removeEventListener('sync-users', handleSync);
  }, []);

  const handleBanToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Banned' : 'Active';
    storageService.updateUserStatus(id, newStatus);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to permanently delete this user?')) {
          storageService.deleteUser(id);
      }
  };

  const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">View and manage registered users.</p>
         </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
               type="text" 
               placeholder="Search users..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-surface border border-gray-600 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary w-64"
            />
         </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
         <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
               <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
               {filteredUsers.length === 0 ? (
                   <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found.</td>
                   </tr>
               ) : (
                   filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="font-medium text-white">{user.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                        <td className="px-6 py-4 text-gray-400">{user.joinDate}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {user.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleBanToggle(user.id, user.status)}
                                  className={`p-2 rounded-lg transition ${
                                      user.status === 'Active' 
                                      ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' 
                                      : 'text-green-500 hover:text-green-400 hover:bg-green-500/10'
                                  }`} 
                                  title={user.status === 'Active' ? "Ban User" : "Activate User"}
                                >
                                    {user.status === 'Active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                </button>
                                <button 
                                  onClick={() => handleDelete(user.id)}
                                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" 
                                  title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                   ))
               )}
            </tbody>
         </table>
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
