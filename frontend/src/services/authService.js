import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        throw new Error('Authentication failed: No token received');
      }
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
};

export default authService;