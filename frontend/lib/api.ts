import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
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

// Auth APIs
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  getCompleteProfile: () => api.get('/users/me/complete'),
  updateProfile: (data: any) => api.put('/users/me', data),
};

// Resume APIs
export const resumeAPI = {
  getResume: () => api.get('/resumes'),
  createResume: (data: any) => api.post('/resumes', data),
  updateResume: (data: any) => api.put('/resumes', data),
  regenerate: () => api.post('/resumes/regenerate'),
  export: (format: 'json' | 'pdf') => api.get(`/resumes/export?format=${format}`),
};

// Achievement APIs
export const achievementAPI = {
  getAll: (type?: string) => api.get('/achievements', { params: { type } }),
  getOne: (id: string) => api.get(`/achievements/${id}`),
  create: (data: any) => api.post('/achievements', data),
  update: (id: string, data: any) => api.put(`/achievements/${id}`, data),
  delete: (id: string) => api.delete(`/achievements/${id}`),
  getStats: () => api.get('/achievements/stats'),
};

export default api;

