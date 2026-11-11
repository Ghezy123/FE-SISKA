import { api } from './api';
import { STORAGE_KEYS } from '../utils/constants';

const normalizeUser = (u) => {
  if (!u) return null;
  return {
    id: u.id_user || u.id || 1,
    id_user: u.id_user || u.id || 1,
    nama: u.nama_lengkap || u.nama || 'Petugas Toko',
    nama_lengkap: u.nama_lengkap || u.nama || 'Petugas Toko',
    username: u.username,
    role: u.role || 'Owner',
    status_aktif: u.status_aktif ?? true,
  };
};

export const authService = {
  async login(credentials) {
    if (!credentials.username || !credentials.password) {
      throw new Error('Username dan password wajib diisi');
    }

    try {
      const res = await api.post('/auth/login', {
        username: credentials.username.trim(),
        password: credentials.password,
      });

      const backendUser = normalizeUser(res.data?.user || res.data);
      if (res.data?.csrf_token) {
        api.setCsrfToken(res.data.csrf_token);
      }

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'session-cookie-active');
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(backendUser));
      return backendUser;
    } catch (err) {
      // Jika error berasal dari response HTTP backend (400, 401, 403, 429, dsb), teruskan pesan aslinya
      if (err.status) {
        throw err;
      }

      // Server BE tidak dapat dijangkau — tampilkan pesan yang jelas
      throw new Error('Tidak dapat terhubung ke server. Pastikan server backend sudah berjalan.');
    }
  },

  async verifySession() {
    try {
      const res = await api.get('/auth/me');
      const backendUser = normalizeUser(res.data?.user || res.data);
      if (res.data?.csrf_token) {
        api.setCsrfToken(res.data.csrf_token);
      }
      if (backendUser) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'session-cookie-active');
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(backendUser));
      }
      return backendUser;
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        return null;
      }
      return authService.getCurrentUser();
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Abaikan jika server sedang offline
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  getCurrentUser() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};
