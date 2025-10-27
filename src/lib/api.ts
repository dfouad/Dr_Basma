import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; password2: string; first_name?: string; last_name?: string }) =>
    api.post('/auth/register/', data),
  
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  
  getProfile: () =>
    api.get('/auth/profile/'),
  
  updateProfile: (data: { first_name?: string; last_name?: string }) =>
    api.patch('/auth/profile/', data),
  
  changePassword: (oldPassword: string, newPassword: string) =>
    api.put('/auth/change-password/', { old_password: oldPassword, new_password: newPassword }),
};

// Courses API
export const coursesAPI = {
  getAll: () =>
    api.get('/courses/'),
  
  getById: (id: number) =>
    api.get(`/courses/${id}/`),
  
  getVideos: (courseId: number) =>
    api.get(`/courses/${courseId}/videos/`),
  
  getCategories: () =>
    api.get('/categories/'),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () =>
    api.get('/enrollments/'),
  
  create: (courseId: number) =>
    api.post('/enrollments/create/', { course: courseId }),
  
  updateProgress: (enrollmentId: number, progress: number, lastWatchedVideoId?: number) =>
    api.put(`/enrollments/${enrollmentId}/update/`, {
      progress,
      last_watched_video: lastWatchedVideoId,
    }),
};

export default api;
