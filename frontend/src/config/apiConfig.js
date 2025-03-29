// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
const API_ENDPOINTS = {
  // Product Service
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  BRANDS: '/brands',
  CATEGORIES: '/categories',
  REVIEWS: '/reviews',
  
  // User Service
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  USER_PROFILE: '/users/me',
  ADDRESSES: '/addresses',
  
  // Cart Service
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  REMOVE_FROM_CART: '/cart/remove',
  CHECKOUT: '/checkout',
  
  // Order Service
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
};

export { API_BASE_URL, API_ENDPOINTS };