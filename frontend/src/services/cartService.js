import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const cartService = {
  // Get cart for a user
  getCart: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CART}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },
  
  // Add item to cart
  addToCart: async (userId, productId, quantity) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.CART}/${userId}/items`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
  
  // Update cart item quantity
  updateCartItem: async (userId, productId, quantity) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.CART}/${userId}/items/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },
  
  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.CART}/${userId}/items/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },
  
  // Clear cart
  clearCart: async (userId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.CART}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
  
  // Get product details (for local cart)
  getProductDetails: async (productId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }
};

export default cartService;