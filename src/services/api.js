import axios from 'axios';

import { API_BASE_URL, AUTH_ENDPOINTS } from '../utils/constants';
import { 
  getAccessToken, 
  getRefreshToken, 
  setAccessToken,
  clearAllStorage 
} from '../utils/storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    
    // If we have a token, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    // Request setup failed (rare)
    console.error('Request setup error:', error);
    return Promise.reject(error);
  }
);





let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};


api.interceptors.response.use(
  // Success response - just return data
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  
  // Error response - handle token refresh
  async (error) => {
    const originalRequest = error.config;
    
    // If error is not 401 or we already tried to refresh, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
    
    // Mark that we're refreshing
    originalRequest._retry = true;
    isRefreshing = true;
    
    const refreshToken = getRefreshToken();
    
    // If no refresh token, logout user
    if (!refreshToken) {
      isRefreshing = false;
      clearAllStorage();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    try {
      // Call refresh endpoint
      const response = await axios.post(
        `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`,
        { refreshToken }
      );
      
      const { accessToken } = response.data;
      
      // Save new access token
      setAccessToken(accessToken);
      
      // Update Authorization header for original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      // Process all queued requests
      processQueue(null, accessToken);
      
      isRefreshing = false;
      
      // Retry original request with new token
      return api(originalRequest);
      
    } catch (refreshError) {
      // Refresh failed - logout user
      processQueue(refreshError, null);
      isRefreshing = false;
      
      clearAllStorage();
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    }
  }
);




/**
 * Handle API errors in a consistent way
 * Extracts error message from different response formats
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    return {
      status: error.response.status,
      message,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      status: 0,
      message: 'Network error. Please check your connection.',
      data: null,
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      data: null,
    };
  }
};

/**
 * Create FormData helper (for file uploads like face verification)
 */
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};


export default api;