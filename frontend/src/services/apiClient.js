import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Request interceptor failed:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const status = error?.response?.status;
      const url = error?.config?.url || '';
      const isAuthAction = url.includes('/auth/login') || url.includes('/auth/register');

      if (status === 401 && !isAuthAction) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        window.alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    } catch (interceptorError) {
      console.error('Response interceptor failed:', interceptorError);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
