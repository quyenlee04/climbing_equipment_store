import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;