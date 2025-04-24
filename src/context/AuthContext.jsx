import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Simplified Auth Provider for admin access
// In a real application, this would use Supabase or another auth provider
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });
  
  // Admin password - in a real app, this would be handled by a proper authentication system
  // For simplicity, this demo uses a fixed password
  const adminPassword = 'queijos123';

  const login = (password) => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const value = {
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}