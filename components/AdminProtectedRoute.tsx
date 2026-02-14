import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppRoutes } from '../types';
import { authService } from '../services/authService';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  if (!authService.isAdminAuthenticated()) {
    return <Navigate to={AppRoutes.ADMIN_LOGIN} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
