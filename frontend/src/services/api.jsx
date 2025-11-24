// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👉 Adjuntar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Manejar tokens inválidos
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const data = error.response.data || {};
      const detail = data.detail || '';
      const code = data.code || '';

      const isInvalidToken =
        detail.includes('Given token not valid for any token type') ||
        code === 'token_not_valid';

      if (isInvalidToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        // Opcional: window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
