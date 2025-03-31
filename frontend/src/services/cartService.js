import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const cartService = {
  getCart: async (userId) => {
    try {
      const response = await api.get(API_ENDPOINTS.CART_USER(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  addToCart: async (userId, productId, quantity) => {
    try {
        const validQuantity = quantity && Number.isInteger(Number(quantity)) ? Math.max(1, Number(quantity)) : 1;
        
        const response = await api.post(API_ENDPOINTS.CART_ITEMS(userId), {
            productId: Number(productId),
            quantity: validQuantity
        });
        return response.data;
    } catch (error) {
        // More specific error handling
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server error:', error.response.data);
            throw new Error(error.response.data.message || 'Failed to add item to cart');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network error:', error.request);
            throw new Error('Network error - please check your connection');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
            throw error;
        }
    }
},
  updateCartItem: async (userId, itemId, quantity) => {
    try {
      const response = await api.put(API_ENDPOINTS.CART_ITEM(userId, itemId), {
        quantity: Math.max(0, quantity)
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  removeFromCart: async (userId, itemId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.CART_ITEM(userId, itemId));
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  clearCart: async (userId) => {
    try {
      await api.delete(API_ENDPOINTS.CART_CLEAR(userId));
      return { items: [], totalPrice: 0 };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartService;