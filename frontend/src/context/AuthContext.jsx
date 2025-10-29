import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Hydrate auth state synchronously from localStorage to avoid redirects on refresh
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      return token ? { token, role, name, email } : null;
    } catch (_) {
      return null;
    }
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    setUser({ token: data.token, role: data.role, name: data.name, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUser(null);
  };

  const isAuthenticated = !!user?.token;
  const isAdmin = user?.role === 'admin';

  const value = { user, login, logout, isAuthenticated, isAdmin };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
