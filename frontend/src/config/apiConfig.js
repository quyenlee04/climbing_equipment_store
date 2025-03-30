// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
// Add these endpoints to your existing apiConfig.js file
const API_ENDPOINTS = {
  // Product Service
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  BRANDS: '/brands',
  REVIEWS: '/reviews',
  
  // User Service
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  USER_PROFILE: '/users/me',
  ADDRESSES: '/addresses',
  
  // Cart Service
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  REMOVE_FROM_CART: '/cart/remove',
  CHECKOUT: '/checkout',
  
  // Order Service
  USERS: '/users',
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
  UPDATE_ORDER_STATUS: (id) => `/orders/${id}/status`,
  BRANDS: '/brands',
  CATEGORIES: '/categories',
  DASHBOARD_STATS: '/dashboard/stats'
};

export { API_BASE_URL, API_ENDPOINTS };