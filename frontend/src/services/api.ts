import axios from 'axios';
import { AuthResponse, ConvertRequest, ConvertResponse, DiagramsResponse, DiagramResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
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

// Response interceptor to handle auth errors
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

export const authApi = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const convertApi = {
  convert: async (data: ConvertRequest): Promise<ConvertResponse> => {
    const response = await api.post('/convert', data);
    return response.data;
  },
};

export const diagramApi = {
  getAll: async (): Promise<DiagramsResponse> => {
    const response = await api.get('/diagrams');
    return response.data;
  },

  getById: async (id: string): Promise<DiagramResponse> => {
    const response = await api.get(`/diagrams/${id}`);
    return response.data;
  },

  getPublic: async (id: string): Promise<DiagramResponse> => {
    const response = await api.get(`/diagrams/share/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  },

  toggleShare: async (id: string, shared: boolean): Promise<DiagramResponse> => {
    const response = await api.patch(`/diagrams/${id}/share`, { shared });
    return response.data;
  },

  update: async (id: string, data: { code: string; language: string; shared?: boolean }): Promise<DiagramResponse> => {
    const response = await api.patch(`/diagrams/${id}`, data);
    return response.data;
  },

  exportSvg: async (mermaid: string): Promise<Blob> => {
    const response = await api.post('/diagrams/export', { mermaid }, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;