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
  // Update the createProduct method
  createProduct: async (formData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS, formData);
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Update the updateProduct method similarly
  updateProduct: async (id, productData) => {
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Add all product fields to the FormData
      Object.keys(productData).forEach(key => {
        // Skip null or undefined values
        if (productData[key] !== null && productData[key] !== undefined) {
          // Handle file objects specially
          if (key === 'image' && productData[key] instanceof File) {
            formData.append('image', productData[key]);
          } 
          // Handle other fields
          else if (typeof productData[key] !== 'object') {
            formData.append(key, productData[key]);
          }
        }
      });
      
      // Send the request with FormData
      const response = await api.request(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
      });
      
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