import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach the token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bjf_auth_token') || localStorage.getItem('ceo_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Redirect to login on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bjf_auth_token');
      localStorage.removeItem('ceo_auth_token');
      // Dispatch custom event to let React Router handle the redirect without a hard reload
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

