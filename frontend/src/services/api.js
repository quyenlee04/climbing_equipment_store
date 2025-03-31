const API_BASE_URL = 'http://localhost:8080/api';

const api = {
  // Update the request method to better handle responses
  request: async (endpoint, options = {}) => {
    try {
      // Validate endpoint
      if (!endpoint || typeof endpoint !== 'string') {
        throw new Error('Invalid endpoint parameters');
      }
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const url = `${API_BASE_URL}/${cleanEndpoint}`;

      // Initialize headers
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Process endpoint to ensure it's clean
      // const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      // const url = `${API_BASE_URL}/${cleanEndpoint}`;
      
      // Prepare the config
      const config = {
        ...options,
        headers
      };
      
      // Only set Content-Type to application/json if we're not sending FormData
      if (options.body instanceof FormData) {
        delete headers['Content-Type']; // Let the browser set this automatically for FormData
      }
      
      // If the body is an object and not FormData, stringify it
      if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
      }
      
      // Execute the fetch request
      const response = await fetch(url, config);
      
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
      
      // Process the response
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
    if (!endpoint) {
      throw new Error('Endpoint is required');
    }
    
    // Clean the endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    
    // Add query parameters if they exist
    if (params && Object.keys(params).length > 0) {
      // Filter out undefined or null values
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
      );
      
      // Create URLSearchParams for proper URL encoding
      const queryParams = new URLSearchParams();
      Object.entries(filteredParams).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        // Use URL with query parameters in the request
        return api.request(`${cleanEndpoint}?${queryString}`, { method: 'GET' });
      }
    }
    
    // If no params or they're all undefined/null, just use the endpoint
    return api.request(cleanEndpoint, { method: 'GET' });
  },
  
  post: (endpoint, data) => {
    return api.request(endpoint, {
      method: 'POST',
      body: data
    });
  },
  
  put: (endpoint, data) => {
    return api.request(endpoint, {
      method: 'PUT',
      body: data
    });
  },
  
  delete: (endpoint) => {
    return api.request(endpoint, {
      method: 'DELETE'
    });
  }
};

export default api;