import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const productService = {
  // Get all products with optional filters
  getProducts: async (params) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get product details by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCT_DETAILS(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all brands
  getBrands: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.BRANDS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add a review for a product
  addReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.REVIEWS}/${productId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;