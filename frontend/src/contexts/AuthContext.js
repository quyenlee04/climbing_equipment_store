import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setCurrentUser = (user) => {
    setUser(user);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', credentials);
      const { token, id, email, roles } = response.data;
      
      // Store token in both localStorage and axios headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store user info
      const userData = { id, email, roles };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    setUser,
    setIsAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};