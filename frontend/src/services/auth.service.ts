import api from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  signup: async (data: Record<string, unknown>): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  
  login: async (data: Record<string, unknown>): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};