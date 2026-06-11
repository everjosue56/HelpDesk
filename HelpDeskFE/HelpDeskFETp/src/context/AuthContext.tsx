import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Definimos el contrato de qué información tiene el usuario
interface UserSession {
  id: number;
  username: string;
  email: string;
  roles: ("Administrador" | "TI" | "Cliente")[];
  permissions: {
    action: string;
    subject: string;
  }[];
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (token: string, userData: UserSession) => void;
  logout: () => void;
  isLoading: boolean;
  getInitials : () => string; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, verificamos si ya había un token y sesión guardada
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user_session');

    if (token && savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: UserSession) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_session', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_session');
    setUser(null);
  };

  //funcion para detectar las iniciales del usuario para el menu vertical.
  const getInitials = (): string => {
    if (!user || !user.username) return "U"; // 'U' por defecto si no ha cargado

    const words = user.username.trim().split(" ");
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

    // Si viene nombre y apellido, toma la inicial de cada uno
    return (words[0][0] + words[1][0]).toUpperCase();

  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, getInitials, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de forma rápida
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};