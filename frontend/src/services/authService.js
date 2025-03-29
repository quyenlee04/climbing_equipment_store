import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      // Add error checking to handle unexpected response format
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        throw new Error('Authentication failed: No token received');
      }
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;