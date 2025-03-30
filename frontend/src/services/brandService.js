import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const brandService = {
  // Get all brands
  getBrands: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.BRANDS);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },

  // Get a single brand by ID
  getBrandById: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.BRANDS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      throw error;
    }
  },

  // Create a new brand
  createBrand: async (brandData) => {
    try {
      const response = await api.post(API_ENDPOINTS.BRANDS, brandData);
      return response.data;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  // Update a brand
  updateBrand: async (id, brandData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.BRANDS}/${id}`, brandData);
      return response.data;
    } catch (error) {
      console.error(`Error updating brand ${id}:`, error);
      throw error;
    }
  },

  // Delete a brand
  deleteBrand: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.BRANDS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting brand ${id}:`, error);
      throw error;
    }
  }
};

export default brandService;