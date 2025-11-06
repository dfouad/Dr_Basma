import axios from 'axios';

const DEFAULT_API_BASE = typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE;

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
  
  getPDFs: (courseId: number) =>
    api.get(`/courses/${courseId}/pdfs/`),
  
  enroll: (courseId: number) =>
    api.post(`/courses/${courseId}/enroll/`),
  
  getCategories: () =>
    api.get('/categories/'),

  // Admin endpoints
  getAllAdmin: () =>
    api.get('/admin/courses/'),
  
  create: (data: any) =>
    api.post('/admin/courses/create/', data),
  
  update: (id: number, data: any) =>
    api.put(`/admin/courses/${id}/update/`, data),
  
  delete: (id: number) =>
    api.delete(`/admin/courses/${id}/delete/`),
};

// Videos API
export const videosAPI = {
  getAll: (courseId?: number) =>
    api.get('/admin/videos/', { params: courseId ? { course: courseId } : {} }),
  
  create: (data: any) =>
    api.post('/admin/videos/create/', data),
  
  update: (id: number, data: any) =>
    api.patch(`/admin/videos/${id}/update/`, data),
  
  delete: (id: number) =>
    api.delete(`/admin/videos/${id}/delete/`),
};

// Users API
export const usersAPI = {
  getAll: () =>
    api.get('/admin/users/'),
  
  update: (id: number, data: any) =>
    api.put(`/admin/users/${id}/update/`, data),
  
  delete: (id: number) =>
    api.delete(`/admin/users/${id}/delete/`),
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

// PDFs API
export const pdfsAPI = {
  getAll: () =>
    api.get('/admin/pdfs/'),
  
  create: (data: FormData) =>
    api.post('/admin/pdfs/create/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id: number, data: FormData) =>
    api.put(`/admin/pdfs/${id}/update/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  delete: (id: number) =>
    api.delete(`/admin/pdfs/${id}/delete/`),
};

// Certificates API
export const certificatesAPI = {
  getUserCertificates: () =>
    api.get('/certificates/'),
  
  getAllAdmin: () =>
    api.get('/admin/certificates/'),
  
  create: (data: { user: number; course: number; enrollment?: number; template_text?: string }) =>
    api.post('/admin/certificates/create/', data),
  
  update: (id: number, data: { template_text?: string }) =>
    api.put(`/admin/certificates/${id}/update/`, data),
  
  delete: (id: number) =>
    api.delete(`/admin/certificates/${id}/delete/`),
};

export default api;
