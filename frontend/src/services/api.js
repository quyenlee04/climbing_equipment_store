const API_BASE_URL = 'http://localhost:8080/api';

const api = {
  // Update the request method to better handle responses
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    // Initialize headers
    const headers = {
      ...options.headers
    };
    
    // Only set Content-Type to application/json if we're not sending FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers
    };
    
    // If the body is an object and not FormData, stringify it
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }
    
    try {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      const response = await fetch(`${API_BASE_URL}/${cleanEndpoint}`, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      
      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
      
      // Check if response is empty
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return { data }; // Ensure we always return an object with a data property
      }
      
      return { data: {} }; // Return empty data for non-JSON responses
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  get: (endpoint, params = {}) => {
    // Fix: Clean the endpoint here too to avoid double /api/api/
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    
    // Create the URL with the base and endpoint
    let url = `${API_BASE_URL}/${cleanEndpoint}`;
    
    // Add query parameters if they exist
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return api.request(cleanEndpoint, {
      method: 'GET',
      params
    });
  },
  
  post: (endpoint, data) => {
    return api.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (endpoint, data) => {
    return api.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: (endpoint) => {
    return api.request(endpoint, {
      method: 'DELETE'
    });
  }
};

export default api;