import { api } from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async login(credentials) {
    // Simulasi atau request ke backend: return api.post('/auth/login', credentials);
    // Untuk keperluan template / pengembangan awal:
    if (credentials.username && credentials.password) {
      const mockUser = {
        id: 'usr_01',
        nama: 'Kasir SISKA',
        username: credentials.username,
        role: 'admin',
        token: 'mock-jwt-token-siska-2026',
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockUser.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error('Username dan password wajib diisi');
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  getCurrentUser() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return saved ? JSON.parse(saved) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};

