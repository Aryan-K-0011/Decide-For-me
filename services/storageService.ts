import { User, QuizQuestion } from "../types";

// Keys
const KEYS = {
  USERS: 'dfm_users_db',
  LOGS: 'dfm_activity_logs',
  CATEGORIES: 'dfm_categories',
  QUIZ: 'dfm_quiz_questions',
  FEEDBACK: 'dfm_feedbacks'
};

// Initial Data Generators
const getInitialUsers = () => [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', username: '@alex', joinDate: '2023-10-12', status: 'Active', avatar: '' },
  { id: '2', name: 'Sarah Connor', email: 'sarah@example.com', username: '@sarah', joinDate: '2023-11-05', status: 'Active', avatar: '' },
];

const getInitialCategories = () => [
  { id: 1, name: 'Outfit & Style', count: 120 },
  { id: 2, name: 'Travel Plans', count: 85 },
  { id: 3, name: 'Food & Dining', count: 210 },
  { id: 4, name: 'Shopping', count: 180 },
];

const getInitialQuiz = (): QuizQuestion[] => [
  {
    id: 1,
    question: "Pick a weekend activity:",
    options: [
      { label: "Art Gallery & Coffee", value: "A", vibe: "Classy" },
      { label: "Rooftop Party", value: "B", vibe: "Trendy" },
      { label: "Hiking & Nature", value: "C", vibe: "Grounded" },
      { label: "DIY Project at Home", value: "D", vibe: "Creative" },
    ]
  },
  {
    id: 2,
    question: "Choose a color palette:",
    options: [
      { label: "Beige & Neutrals", value: "A", vibe: "Classy" },
      { label: "Neon & Black", value: "B", vibe: "Trendy" },
      { label: "Earth Tones", value: "C", vibe: "Grounded" },
      { label: "Pastels", value: "D", vibe: "Creative" },
    ]
  },
  {
    id: 3,
    question: "Your go-to outfit is:",
    options: [
      { label: "Blazer & Trousers", value: "A", vibe: "Classy" },
      { label: "Streetwear & Sneakers", value: "B", vibe: "Trendy" },
      { label: "Comfortable Linen", value: "C", vibe: "Grounded" },
      { label: "Vintage Mix-Match", value: "D", vibe: "Creative" },
    ]
  }
];

export const storageService = {
  // --- USERS ---
  getUsers: (): any[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : getInitialUsers();
  },
  saveUser: (user: any) => {
    const users = storageService.getUsers();
    // Check if exists
    const exists = users.find(u => u.email === user.email);
    if (!exists) {
        users.push({ ...user, status: 'Active', joinDate: new Date().toISOString().split('T')[0] });
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
        window.dispatchEvent(new Event('sync-users'));
    }
  },
  updateUserStatus: (id: string, status: string) => {
    const users = storageService.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, status } : u);
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    window.dispatchEvent(new Event('sync-users'));
  },
  updateUserDetails: (updatedUser: User) => {
    const users = storageService.getUsers();
    // Find user by ID (or email if id mismatch, but ID is safer)
    const index = users.findIndex(u => u.id === updatedUser.id || u.email === updatedUser.email);
    
    if (index !== -1) {
        // Merge existing data (preserving status, joinDate) with new profile data
        users[index] = { ...users[index], ...updatedUser };
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
        window.dispatchEvent(new Event('sync-users'));
    }
  },
  deleteUser: (id: string) => {
    const users = storageService.getUsers();
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    window.dispatchEvent(new Event('sync-users'));
  },

  // --- LOGS ---
  getLogs: () => {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  addLog: (user: string, category: string, prompt: string, status: 'Success' | 'Failed') => {
    const logs = storageService.getLogs();
    const newLog = {
        id: Date.now(),
        user,
        category,
        prompt: prompt.substring(0, 30) + '...',
        time: new Date().toLocaleTimeString(),
        status
    };
    // Keep last 50 logs
    const updated = [newLog, ...logs].slice(0, 50);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('sync-logs'));
    
    // Update Category Count
    const cats = storageService.getCategories();
    const catIndex = cats.findIndex(c => c.name.includes(category));
    if(catIndex >= 0) {
        cats[catIndex].count += 1;
        localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
        window.dispatchEvent(new Event('sync-content'));
    }
  },

  // --- CONTENT (Categories & Quiz) ---
  getCategories: () => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : getInitialCategories();
  },
  saveCategories: (categories: any[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('sync-content'));
  },
  getQuizQuestions: (): QuizQuestion[] => {
    const data = localStorage.getItem(KEYS.QUIZ);
    return data ? JSON.parse(data) : getInitialQuiz();
  },
  saveQuizQuestions: (questions: QuizQuestion[]) => {
    localStorage.setItem(KEYS.QUIZ, JSON.stringify(questions));
    window.dispatchEvent(new Event('sync-content'));
  },

  // --- FEEDBACK ---
  getFeedback: () => {
    const data = localStorage.getItem(KEYS.FEEDBACK);
    return data ? JSON.parse(data) : [];
  },
  addFeedback: (username: string, msg: string, type: 'Feedback' | 'Bug Report') => {
      const feed = storageService.getFeedback();
      const newFeed = {
          id: Date.now(),
          user: username,
          msg,
          type,
          date: 'Just now',
          status: 'New'
      };
      localStorage.setItem(KEYS.FEEDBACK, JSON.stringify([newFeed, ...feed]));
      window.dispatchEvent(new Event('sync-feedback'));
  },
  updateFeedback: (updatedFeedbacks: any[]) => {
      localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(updatedFeedbacks));
      window.dispatchEvent(new Event('sync-feedback'));
  }
};