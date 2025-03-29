import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD_STATS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getSalesData: async (period = 'month') => {
    try {
      const response = await api.get(`${API_ENDPOINTS.DASHBOARD_STATS}/sales?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getTopProducts: async (limit = 5) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.DASHBOARD_STATS}/top-products?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.DASHBOARD_STATS}/recent-activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default dashboardService;