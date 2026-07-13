import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode; 
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-neutral-100">
        <p className="text-sm font-semibold text-neutral-500 animate-pulse">Verificando credenciales...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

 // validacion de los roles 
  const hasRequiredRol = user.roles.some(userRol => 
    allowedRoles.map(r => r.toLowerCase()).includes(userRol.toLowerCase())
  );

  if (!hasRequiredRol) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};