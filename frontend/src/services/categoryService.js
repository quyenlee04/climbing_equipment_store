import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get a single category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CATEGORIES, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update a category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};

export default categoryService;