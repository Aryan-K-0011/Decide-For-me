import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, MessageCircle, CheckCircle, Activity, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { storageService } from '../../services/storageService';

const trafficData = [
  { name: 'Mon', visits: 4000, decisions: 2400 },
  { name: 'Tue', visits: 3000, decisions: 1398 },
  { name: 'Wed', visits: 2000, decisions: 9800 },
  { name: 'Thu', visits: 2780, decisions: 3908 },
  { name: 'Fri', visits: 1890, decisions: 4800 },
  { name: 'Sat', visits: 2390, decisions: 3800 },
  { name: 'Sun', visits: 3490, decisions: 4300 },
];

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];

const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    // Initial Load
    setLogs(storageService.getLogs());
    setUserCount(storageService.getUsers().length);
    setCategoryData(storageService.getCategories());

    // Listeners
    const handleLogs = () => setLogs(storageService.getLogs());
    const handleUsers = () => setUserCount(storageService.getUsers().length);
    const handleContent = () => setCategoryData(storageService.getCategories());

    window.addEventListener('sync-logs', handleLogs);
    window.addEventListener('sync-users', handleUsers);
    window.addEventListener('sync-content', handleContent);

    return () => {
        window.removeEventListener('sync-logs', handleLogs);
        window.removeEventListener('sync-users', handleUsers);
        window.removeEventListener('sync-content', handleContent);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
         <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
         <p className="text-gray-400">Welcome back, Admin. Real-time system monitor.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {[
           { label: 'Total Users', val: userCount, icon: <Users className="text-blue-400" />, change: 'Real-time' },
           { label: 'Total Activities', val: logs.length, icon: <CheckCircle className="text-green-400" />, change: 'Real-time' },
           { label: 'Active Sessions', val: '4', icon: <MessageCircle className="text-pink-400" />, change: '+5%' },
           { label: 'Engagement', val: '68%', icon: <Activity className="text-orange-400" />, change: '+2%' },
         ].map((stat, i) => (
           <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
                 <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.val}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
           </div>
         ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 h-96">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={20} className="text-primary" /> Traffic Analysis
             </h3>
             <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDecisions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#374151', color: '#fff' }} 
                  />
                  <Area type="monotone" dataKey="visits" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVisits)" />
                  <Area type="monotone" dataKey="decisions" stroke="#ec4899" fillOpacity={1} fill="url(#colorDecisions)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* Category Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 h-96">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={20} className="text-secondary" /> Category Usage (Sync)
             </h3>
             <ResponsiveContainer width="100%" height="85%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#374151', color: '#fff' }} 
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
      </div>

      {/* AI Recommendation Logs */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
         <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <FileText size={20} className="text-blue-400" /> Real-time Activity Logs
         </h3>
         <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                   <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Prompt Snippet</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                   {logs.length === 0 ? (
                       <tr><td colSpan={5} className="p-4 text-center text-gray-500">No activity yet.</td></tr>
                   ) : logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition text-sm">
                         <td className="px-4 py-3 font-bold text-white">{log.user}</td>
                         <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded text-xs ${
                                 log.category === 'Outfit' ? 'bg-pink-500/20 text-pink-400' :
                                 log.category === 'Food' ? 'bg-orange-500/20 text-orange-400' :
                                 log.category === 'Travel' ? 'bg-blue-500/20 text-blue-400' :
                                 'bg-purple-500/20 text-purple-400'
                             }`}>
                                 {log.category}
                             </span>
                         </td>
                         <td className="px-4 py-3 text-gray-400 truncate max-w-xs">{log.prompt}</td>
                         <td className="px-4 py-3 text-gray-500">{log.time}</td>
                         <td className="px-4 py-3">
                            <span className={`flex items-center gap-1 ${log.status === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                               {log.status === 'Success' ? <CheckCircle size={14} /> : <Activity size={14} />}
                               {log.status}
                            </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
         </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
