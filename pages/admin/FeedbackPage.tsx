import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { MessageSquare, TriangleAlert, Check, Trash2 } from 'lucide-react';
import { storageService } from '../../services/storageService';

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    setFeedbacks(storageService.getFeedback());
    const handleSync = () => setFeedbacks(storageService.getFeedback());
    window.addEventListener('sync-feedback', handleSync);
    return () => window.removeEventListener('sync-feedback', handleSync);
  }, []);

  const handleResolve = (id: number) => {
    const updated = feedbacks.map(f => f.id === id ? { ...f, status: 'Resolved' } : f);
    storageService.updateFeedback(updated);
  };

  const handleDelete = (id: number) => {
    if(window.confirm('Delete this feedback?')) {
        const updated = feedbacks.filter(f => f.id !== id);
        storageService.updateFeedback(updated);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
         <h1 className="text-3xl font-bold text-white">Feedback & Reports</h1>
         <p className="text-gray-400">User feedback submitted from the app.</p>
      </div>

      <div className="space-y-4">
         {feedbacks.length === 0 ? (
             <div className="text-center py-10 text-gray-500">No new feedback.</div>
         ) : (
             feedbacks.map(item => (
                <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                   <div className="flex items-start gap-4">
                      <div className={`mt-1 p-3 rounded-xl ${item.type === 'Bug Report' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                         {item.type === 'Bug Report' ? <TriangleAlert size={20} /> : <MessageSquare size={20} />}
                      </div>
                      <div>
                         <h3 className="font-bold text-white text-lg">{item.type} <span className="text-xs font-normal text-gray-500 ml-2">{item.date}</span></h3>
                         <p className="text-gray-300 mb-1">{item.msg}</p>
                         <p className="text-xs text-primary font-bold">{item.user}</p>
                      </div>
                   </div>
    
                   <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                         item.status === 'New' ? 'bg-green-500/20 text-green-400' : 
                         item.status === 'Resolved' ? 'bg-gray-700 text-gray-400' : 
                         'bg-yellow-500/20 text-yellow-400'
                      }`}>
                         {item.status}
                      </span>
                      
                      <div className="flex gap-2">
                        {item.status !== 'Resolved' && (
                            <button 
                                onClick={() => handleResolve(item.id)}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                                title="Mark Resolved"
                            >
                                <Check size={16} />
                            </button>
                        )}
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                   </div>
                </div>
             ))
         )}
      </div>
    </AdminLayout>
  );
};

export default FeedbackPage;