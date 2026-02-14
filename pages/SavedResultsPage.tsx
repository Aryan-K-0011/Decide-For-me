import React, { useEffect, useState } from 'react';
import { SavedDecision } from '../types';
import { Bookmark, Clock, Trash2, Search, Filter } from 'lucide-react';
import { userService } from '../services/userService';

const SavedResultsPage: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedDecision[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setSavedItems(userService.getSavedDecisions());
    const handleDataChange = () => setSavedItems(userService.getSavedDecisions());
    window.addEventListener('dataChange', handleDataChange);
    return () => window.removeEventListener('dataChange', handleDataChange);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this decision?')) {
      userService.deleteDecision(id);
    }
  };

  const filteredItems = savedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Outfit', 'Travel', 'Food', 'Shopping', 'Other'];

  return (
    <div className="pt-24 pb-12 min-h-screen px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
           <Bookmark className="text-secondary" /> Saved Results
        </h1>
        <p className="text-gray-400">All your AI recommendations in one place.</p>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search your history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary"
            />
         </div>
         
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                   selectedCategory === cat 
                     ? 'bg-primary text-white' 
                     : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                 }`}
               >
                 {cat}
               </button>
            ))}
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
               No results found.
            </div>
         ) : (
            filteredItems.map(item => (
               <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                     <div className={`px-3 py-1 rounded-lg text-xs font-bold bg-white/5 ${
                        item.category === 'Outfit' ? 'text-pink-400' :
                        item.category === 'Travel' ? 'text-blue-400' :
                        item.category === 'Food' ? 'text-orange-400' : 'text-purple-400'
                     }`}>
                        {item.category}
                     </div>
                     <button 
                       onClick={() => handleDelete(item.id)}
                       className="text-gray-600 hover:text-red-400 transition"
                     >
                        <Trash2 size={18} />
                     </button>
                  </div>
                  
                  {item.image && (
                     <div className="mb-4 rounded-xl overflow-hidden h-40 bg-black/20">
                        <img src={item.image} alt="Ref" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                     </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-grow">{item.summary}</p>
                  
                  <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
                     <span className="flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
};

export default SavedResultsPage;
