import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const orderService = {
  // Get all orders for current user
  getOrders: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order details by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDER_DETAILS(orderId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ORDERS}/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;