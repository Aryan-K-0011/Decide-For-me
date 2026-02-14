import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Pen, Trash2, Plus, Layers, CircleHelp, Save, X } from 'lucide-react';
import { storageService } from '../../services/storageService';

const ContentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'quiz'>('categories');
  const [categories, setCategories] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('Personality');

  useEffect(() => {
    setCategories(storageService.getCategories());
    setQuestions(storageService.getQuizQuestions());
    
    const handleSync = () => {
        setCategories(storageService.getCategories());
        setQuestions(storageService.getQuizQuestions());
    };
    window.addEventListener('sync-content', handleSync);
    return () => window.removeEventListener('sync-content', handleSync);
  }, []);

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Delete this category?')) {
        const updated = categories.filter(c => c.id !== id);
        storageService.saveCategories(updated);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    if (window.confirm('Delete this question?')) {
        const updated = questions.filter(q => q.id !== id);
        storageService.saveQuizQuestions(updated);
    }
  };

  const handleAddItem = () => {
      if (!newItemName.trim()) return;

      if (activeTab === 'categories') {
          const newCat = {
              id: Date.now(),
              name: newItemName,
              count: 0
          };
          const updated = [...categories, newCat];
          storageService.saveCategories(updated);
      } else {
          // New Question with default options for demo
          const newQ = {
              id: Date.now(),
              question: newItemName, // Changed 'q' to 'question' to match types
              options: [
                { label: "Option A", value: "A", vibe: "Classy" },
                { label: "Option B", value: "B", vibe: "Trendy" },
              ]
          };
          const updated = [...questions, newQ];
          storageService.saveQuizQuestions(updated);
      }
      setIsAdding(false);
      setNewItemName('');
  };

  return (
    <AdminLayout>
      <div className="mb-8">
         <h1 className="text-3xl font-bold text-white">Content Management</h1>
         <p className="text-gray-400">Manage categories and quiz questions. (Updates User App)</p>
      </div>

      <div className="flex gap-4 mb-6">
         <button 
           onClick={() => { setActiveTab('categories'); setIsAdding(false); }}
           className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'categories' ? 'bg-primary text-white' : 'glass-panel text-gray-400 hover:text-white'}`}
         >
            <Layers size={18} /> Categories
         </button>
         <button 
           onClick={() => { setActiveTab('quiz'); setIsAdding(false); }}
           className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === 'quiz' ? 'bg-primary text-white' : 'glass-panel text-gray-400 hover:text-white'}`}
         >
            <CircleHelp size={18} /> Quiz Questions
         </button>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/5">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
               {activeTab === 'categories' ? 'Active Categories' : 'Quiz Questions Library'}
            </h2>
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
            >
               {isAdding ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add New</>}
            </button>
         </div>

         {/* Add Item Form */}
         {isAdding && (
             <div className="bg-white/5 p-4 rounded-xl mb-6 border border-primary/30 animate-fade-in-up">
                 <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Add New {activeTab === 'categories' ? 'Category' : 'Question'}</h3>
                 <div className="flex flex-col md:flex-row gap-4">
                     <input 
                        type="text" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder={activeTab === 'categories' ? "Category Name (e.g. Technology)" : "Question Text"}
                        className="flex-1 bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                     />
                     <button 
                        onClick={handleAddItem}
                        className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                     >
                         <Save size={16} /> Save
                     </button>
                 </div>
             </div>
         )}

         {activeTab === 'categories' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {categories.map(cat => (
                  <div key={cat.id} className="bg-surface p-4 rounded-xl flex items-center justify-between border border-gray-700">
                     <div>
                        <h3 className="font-bold text-white">{cat.name}</h3>
                        <p className="text-xs text-gray-400">{cat.count} uses</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="space-y-4">
               {questions.map(q => (
                  <div key={q.id} className="bg-surface p-4 rounded-xl flex items-center justify-between border border-gray-700">
                     <div>
                        <h3 className="font-bold text-white mb-1">{q.question}</h3>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{q.options.length} options</span>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </AdminLayout>
  );
};

export default ContentManagementPage;