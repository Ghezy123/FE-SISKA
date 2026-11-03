import { api } from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async login(credentials) {
    if (!credentials.username || !credentials.password) {
      throw new Error('Username dan password wajib diisi');
    }

    // Validasi kredensial (Hardcoded sesuai spesifikasi)
    // Username: "Alya fotocopy" (toleran huruf besar/kecil & spasi)
    // Password: "Sawahlunto123" (case-sensitive)
    const validUsername = 'alya fotocopy';
    const validPassword = 'Sawahlunto123';

    const inputUser = credentials.username.trim().toLowerCase();
    const inputPass = credentials.password;

    if (inputUser === validUsername && inputPass === validPassword) {
      const mockUser = {
        id: 'usr_01',
        nama: 'Petugas Toko',
        username: credentials.username.trim(),
        role: 'admin',
        token: 'mock-jwt-token-siska-2026',
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockUser.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
      return mockUser;
    }

    throw new Error('Username atau password salah. Silakan coba lagi.');
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

