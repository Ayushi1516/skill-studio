import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { currentUser } = useAuth();

  if (!currentUser || (requiredRole && currentUser.role !== requiredRole)) {
    // Redirect to login if not authenticated, or to home if unauthorized role
    return <Navigate to={currentUser ? "/" : "/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;