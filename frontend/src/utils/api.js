import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updatePassword: (currentPassword, newPassword) => 
    api.put('/auth/password', { currentPassword, newPassword }),
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  createUser: (userData) => api.post('/users', userData),
  getUserById: (id) => api.get(`/users/${id}`),
  getDashboardStats: () => api.get('/users/stats'),
};


export const storeAPI = {
  getStores: (params) => api.get('/stores', { params }),
  createStore: (storeData) => api.post('/stores', storeData),
  getStoreById: (id) => api.get(`/stores/${id}`),
  getOwnerDashboard: () => api.get('/stores/owner/dashboard'),
};

export const ratingAPI = {
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  getUserRatings: () => api.get('/ratings/my-ratings'),
};

export default api;
