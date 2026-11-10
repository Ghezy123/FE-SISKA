// Konstanta umum aplikasi SISKA (Sistem Informasi Stok dan Kasir — Alya Fotocopy)

export const APP_CONFIG = {
  NAME: 'SISKA',
  FULL_NAME: 'Sistem Informasi Stok dan Kasir',
  TAGLINE: 'Sistem Kasir & Inventori Alya Fotocopy',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
};

export const USER_ROLES = {
  OWNER: 'Owner',
  EMPLOYEE: 'Employee',
  KASIR: 'Employee',
  ADMIN: 'Owner',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'siska_token',
  CSRF_TOKEN: 'siska_csrf_token',
  USER_DATA: 'siska_user',
};
