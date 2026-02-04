import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'engineer':
        return <Navigate to="/" replace />;
      case 'solution-architect':
        return <Navigate to="/architect" replace />;
      case 'project-manager':
        return <Navigate to="/manager" replace />;
      case 'viewer':
        return <Navigate to="/viewer" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
