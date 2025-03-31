// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
// Add these endpoints to your existing apiConfig.js file
const API_ENDPOINTS = {
  // Product Service
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  PRODUCT_INFO: (id) => `/products/${id}/info`,
  BRANDS: '/brands',
  REVIEWS: '/reviews',
  
  // User Service
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  USER_PROFILE: '/users/me',
  ADDRESSES: '/addresses',
  
  // Cart Service
  
  CART_USER: (userId) => `/cart/user/${userId}`,
  CART_ITEMS: (userId) => `/cart/user/${userId}/items`,
  CART_ITEM: (userId, itemId) => `/cart/user/${userId}/items/${itemId}`,
  CART_CLEAR: (userId) => `/cart/user/${userId}/clear`,
  CHECKOUT: '/checkout',
  
  // Order Service
  USERS: '/users',
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
  UPDATE_ORDER_STATUS: (id) => `/orders/${id}/status`,
  BRANDS: '/brands',
  CATEGORIES: '/categories',

};

export { API_BASE_URL, API_ENDPOINTS };