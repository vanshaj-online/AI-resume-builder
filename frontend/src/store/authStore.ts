import { create } from 'zustand';
import type { User, UserCredentials } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: Omit<UserCredentials, 'name'>) => Promise<void>;
  signup: (userData: UserCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      set({
        user: data,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: unknown) {
      const message = 'Login failed'
      set({
        error: message,
        isLoading: false
      });
      throw error;
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authService.signup(userData);
      localStorage.setItem('token', data.token);
      set({
        user: data,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: unknown) {
      const message = 'signup failed';
      set({
        error: message,
        isLoading: false
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const { data } = await authService.getCurrentUser();
      set({ user: data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));