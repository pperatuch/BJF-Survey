import { create } from 'zustand';
import api from '../lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  employee_id: string;
  role: string;
  position?: string;
  company?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (empno: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('bjf_auth_token'),
  isAuthenticated: !!localStorage.getItem('bjf_auth_token'),
  isLoading: !!localStorage.getItem('bjf_auth_token'), // เริ่มต้นเป็น true ถ้ามี token เพื่อรอ fetchMe ตรวจสอบสิทธิ์
  error: null,

  login: async (empno, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { empno, password });
      const { token, user } = response.data;

      if (!token || !user || !user.name) {
        throw new Error(response.data?.message || 'ข้อมูลโปรไฟล์ไม่สมบูรณ์ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
      }

      localStorage.setItem('bjf_auth_token', token);

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'การเข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง';
      set({
        isLoading: false,
        error: message,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on server:', err);
    } finally {
      localStorage.removeItem('bjf_auth_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('bjf_auth_token');
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user;
      if (!user || !user.name) {
        throw new Error('ข้อมูลโปรไฟล์ไม่สมบูรณ์ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.error('Fetch me failed:', err);
      localStorage.removeItem('bjf_auth_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
