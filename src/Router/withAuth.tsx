import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * withAuth HOC
 * Wraps a component to provide route protection based on authentication and roles.
 */
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: string
) {
  return (props: P) => {
    const { currentUser } = useAuth();

    if (!currentUser || (requiredRole && currentUser.role !== requiredRole)) {
      // Redirect to login if not authenticated, or to home if unauthorized
      return <Navigate to={currentUser ? "/" : "/login"} replace />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;