import axios from 'axios';
import { getAuthToken } from './auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyToken: () => api.get('/auth/verify-token'),
  getUser: (id) => api.get(`/auth/user/${id}`),
};

export const productsApi = {
  getAll: () => api.get('/products'),
  getAdminAll: () => api.get('/products/admin/all'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const warrantiesApi = {
  getAll: (status) => api.get('/warranties', { params: { status } }),
  getUserRequests: (userId) => api.get(`/warranties/user/${userId}`),
  getUserCards: (userId) => api.get(`/warranties/cards/user/${userId}`),
  getAllCards: () => api.get('/warranties/cards/all'),
  getDetails: (id) => api.get(`/warranties/${id}`),
  apply: (data) => api.post('/warranties', data),
  approve: (id, data) => api.post(`/warranties/${id}/approve`, data),
  reject: (id, data) => api.post(`/warranties/${id}/reject`, data),
  verify: (certNo) => api.get(`/warranties/verify/${certNo}`),
  getStats: (userId) => api.get('/warranties/stats', { params: { userId } }),
};

export const customersApi = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  getStats: () => api.get('/customers/stats'),
  search: (phone) => api.get('/customers/search', { params: { phone } }),
  updateProfile: (id, data) => api.put(`/customers/${id}/profile`, data),
};

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  getByRequest: (requestId) => api.get(`/notifications/request/${requestId}`),
};

export const uploadApi = {
  uploadBill: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/bill', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
