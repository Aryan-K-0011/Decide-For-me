import { User, SavedDecision } from "../types";
import { storageService } from "./storageService";

const USER_KEY = 'dfm_user';
const SAVED_KEY = 'dfm_saved_decisions';
const SPIN_KEY = 'dfm_spin_history';

// Mock initial user
const defaultUser: User = {
  id: '1',
  name: 'Guest User',
  username: '@guest',
  email: 'guest@decideforme.app',
  avatar: '',
  age: '',
  gender: '',
  preferences: {
    style: 'Casual',
    budget: 'Medium',
    food: 'Everything',
    travel: 'Relaxing'
  }
};

export const userService = {
  getUser: (): User => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : defaultUser;
  },

  updateUser: (updatedUser: User) => {
    // 1. Update local session
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    // 2. Sync with central storage for Admin and Persistence
    storageService.updateUserDetails(updatedUser);

    window.dispatchEvent(new Event('userChange'));
  },

  getSavedDecisions: (): SavedDecision[] => {
    const stored = localStorage.getItem(SAVED_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveDecision: (decision: SavedDecision) => {
    const current = userService.getSavedDecisions();
    const updated = [decision, ...current];
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('dataChange'));
  },

  deleteDecision: (id: string) => {
    const current = userService.getSavedDecisions();
    const updated = current.filter(d => d.id !== id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('dataChange'));
  },

  getSpinHistory: (): { result: string; date: string }[] => {
    const stored = localStorage.getItem(SPIN_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveSpinResult: (result: string) => {
    const current = userService.getSpinHistory();
    const newEntry = {
        result,
        date: new Date().toLocaleDateString()
    };
    const updated = [newEntry, ...current].slice(0, 5); // Keep last 5
    localStorage.setItem(SPIN_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('dataChange'));
  }
};