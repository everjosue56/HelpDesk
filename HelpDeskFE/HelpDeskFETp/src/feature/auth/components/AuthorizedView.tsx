import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthorizedViewProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const AuthorizedView: React.FC<AuthorizedViewProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  // Revisa si el usuario tiene al menos uno de los roles permitidos
  const isAuthorized = user.roles.some(r => 
    allowedRoles.map(role => role.toLowerCase()).includes(r.toLowerCase())
  );

  // Si está autorizado, renderiza el botón/módulo; si no, lo esconde por completo
  return isAuthorized ? <>{children}</> : null;
};