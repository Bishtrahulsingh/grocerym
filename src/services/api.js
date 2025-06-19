import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// Extra Items API
export const extraItemsAPI = {
  getAll: () => api.get('/extra-items'),
  getMyItems: () => api.get('/extra-items/my-items'),
  create: (itemData) => api.post('/extra-items', itemData),
  update: (id, itemData) => api.put(`/extra-items/${id}`, itemData),
  delete: (id) => api.delete(`/extra-items/${id}`),
};

export default api;