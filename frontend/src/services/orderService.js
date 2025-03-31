import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const orderService = {
  getOrders: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDER_DETAILS(orderId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post(API_ENDPOINTS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE_ORDER_STATUS(orderId), { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService;