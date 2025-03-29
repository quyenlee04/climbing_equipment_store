import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CART);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity) => {
    try {
      const response = await api.post(API_ENDPOINTS.ADD_TO_CART, {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.REMOVE_FROM_CART}/${cartItemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItemQuantity: async (cartItemId, quantity) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.CART}/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Process checkout
  checkout: async (checkoutData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CHECKOUT, checkoutData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default cartService;