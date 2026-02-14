export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  age?: string;
  gender?: string;
  preferences?: {
    style: string;
    budget: string;
    food: string;
    travel: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string
  timestamp: number;
}

export interface SavedDecision {
  id: string;
  title: string;
  date: string;
  category: 'Outfit' | 'Travel' | 'Food' | 'Shopping' | 'Other';
  summary: string;
  fullDetails?: string;
  image?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string; vibe: string }[];
}

export interface QuizResult {
  vibe: string;
  description: string;
  color: string;
}

export interface ComparisonData {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

export enum AppRoutes {
  HOME = '/',
  ABOUT = '/about',
  HOW_IT_WORKS = '/how-it-works',
  LOGIN = '/login',
  SIGNUP = '/signup',
  FORGOT_PASSWORD = '/forgot-password',
  DASHBOARD = '/dashboard',
  SAVED_RESULTS = '/saved-results',
  PROFILE_SETTINGS = '/profile-settings',
  CHAT = '/chat',
  QUIZ = '/quiz',
  QUIZ_RESULT = '/quiz/result',
  UPLOAD_PHOTO = '/upload-photo',
  RECOMMENDATION_RESULT = '/recommendation-result',
  SPIN = '/spin',
  COMPARE = '/compare',
  
  // Admin Routes
  ADMIN = '/admin',
  ADMIN_LOGIN = '/admin/login',
  ADMIN_DASHBOARD = '/admin/dashboard',
  ADMIN_USERS = '/admin/users',
  ADMIN_CONTENT = '/admin/content',
  ADMIN_FEEDBACK = '/admin/feedback',
}
