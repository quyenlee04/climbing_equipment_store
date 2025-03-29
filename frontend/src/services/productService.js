import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const productService = {
  // Get all products with optional filters
  getProducts: async (params) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS,  params );
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

  // Add these methods to your existing productService.js file
  
  // Category management
  createCategory: async (categoryData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CATEGORIES, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Brand management
  createBrand: async (brandData) => {
    try {
      const response = await api.post(API_ENDPOINTS.BRANDS, brandData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateBrand: async (id, brandData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.BRANDS}/${id}`, brandData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteBrand: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.BRANDS}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;