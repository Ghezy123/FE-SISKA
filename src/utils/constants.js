// Konstanta umum aplikasi SISKA (Sistem Kasir & Inventori)

export const APP_CONFIG = {
  NAME: 'SISKA',
  FULL_NAME: 'Sistem Kasir & Inventori',
  TAGLINE: 'Sistem Kasir & Inventori',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
};

export const USER_ROLES = {
  OWNER: 'owner',
  KASIR: 'kasir',
  ADMIN: 'admin',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'siska_token',
  USER_DATA: 'siska_user',
};
