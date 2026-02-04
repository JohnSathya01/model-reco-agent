import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'engineer' | 'solution-architect' | 'project-manager' | 'viewer';
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (_email: string, _password: string): Promise<boolean> => {
    // This will be replaced with actual API call
    // For now, it's handled in LoginPage component
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    setUser: updateUser,
    isAuthenticated: !!user?.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
