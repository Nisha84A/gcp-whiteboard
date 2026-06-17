import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '@/services/api/authApi';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authApi.login(email, password);
          sessionStorage.setItem('clinicalboard_token', token);
          set({ token, user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          const msg = error.response?.data?.error || error.message || 'Invalid email or password';
          set({ error: msg, isLoading: false });
          return false;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authApi.register(email, password, name);
          sessionStorage.setItem('clinicalboard_token', token);
          set({ token, user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          const msg = error.response?.data?.error || error.message || 'Registration failed';
          set({ error: msg, isLoading: false });
          return false;
        }
      },

      logout: () => {
        sessionStorage.removeItem('clinicalboard_token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      checkAuth: async () => {
        const token = sessionStorage.getItem('clinicalboard_token');
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }
        try {
          set({ isLoading: true });
          const user = await authApi.verifyToken();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch {
          sessionStorage.removeItem('clinicalboard_token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'clinical-auth-store',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
