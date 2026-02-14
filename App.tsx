import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ChatPage from './pages/ChatPage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';
import UploadPhotoPage from './pages/UploadPhotoPage';
import RecommendationResultPage from './pages/RecommendationResultPage';
import SpinWheelPage from './pages/SpinWheelPage';
import ComparisonPage from './pages/ComparisonPage';
import Dashboard from './pages/Dashboard';
import SavedResultsPage from './pages/SavedResultsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import AuthPage from './pages/AuthPage';
// Admin Imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import FeedbackPage from './pages/admin/FeedbackPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AppRoutes } from './types';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary selection:text-white">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path={AppRoutes.HOME} element={<Home />} />
          <Route path={AppRoutes.ABOUT} element={<AboutPage />} />
          <Route path={AppRoutes.HOW_IT_WORKS} element={<HowItWorksPage />} />
          <Route path={AppRoutes.LOGIN} element={<AuthPage type="login" />} />
          <Route path={AppRoutes.SIGNUP} element={<AuthPage type="signup" />} />
          <Route path={AppRoutes.FORGOT_PASSWORD} element={<AuthPage type="forgot-password" />} />
          
          {/* User Protected Routes */}
          <Route path={AppRoutes.CHAT} element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path={AppRoutes.QUIZ} element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path={AppRoutes.QUIZ_RESULT} element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
          <Route path={AppRoutes.UPLOAD_PHOTO} element={<ProtectedRoute><UploadPhotoPage /></ProtectedRoute>} />
          <Route path={AppRoutes.RECOMMENDATION_RESULT} element={<ProtectedRoute><RecommendationResultPage /></ProtectedRoute>} />
          <Route path={AppRoutes.SPIN} element={<ProtectedRoute><SpinWheelPage /></ProtectedRoute>} />
          <Route path={AppRoutes.COMPARE} element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
          <Route path={AppRoutes.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path={AppRoutes.SAVED_RESULTS} element={<ProtectedRoute><SavedResultsPage /></ProtectedRoute>} />
          <Route path={AppRoutes.PROFILE_SETTINGS} element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path={AppRoutes.ADMIN_LOGIN} element={<AdminLoginPage />} />
          <Route path={AppRoutes.ADMIN_DASHBOARD} element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path={AppRoutes.ADMIN_USERS} element={<AdminProtectedRoute><UserManagementPage /></AdminProtectedRoute>} />
          <Route path={AppRoutes.ADMIN_CONTENT} element={<AdminProtectedRoute><ContentManagementPage /></AdminProtectedRoute>} />
          <Route path={AppRoutes.ADMIN_FEEDBACK} element={<AdminProtectedRoute><FeedbackPage /></AdminProtectedRoute>} />
          
          {/* Redirect /admin to login */}
          <Route path={AppRoutes.ADMIN} element={<AdminLoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
