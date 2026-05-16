import axios from 'axios';

// Create an Axios instance pointing to our backend API
const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  timeout: 5000,
});

// ==========================================
// Frontend Logging Middleware (Interceptor)
// ==========================================
// Logs outgoing requests and incoming responses to the browser console

// Request Interceptor
api.interceptors.request.use((config) => {
  const timestamp = new Date().toISOString();
  console.log(`[REQ][${timestamp}] -> ${config.method.toUpperCase()} ${config.url}`);
  // We can attach tokens here if needed in the future
  return config;
}, (error) => {
  console.error('[REQ ERROR]', error);
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use((response) => {
  const timestamp = new Date().toISOString();
  console.log(`[RES][${timestamp}] <- ${response.status} ${response.config.url}`, response.data);
  return response;
}, (error) => {
  const timestamp = new Date().toISOString();
  console.error(`[RES ERROR][${timestamp}] <- ${error.response?.status || 'Network Error'}`, error.message);
  return Promise.reject(error);
});

export default api;
