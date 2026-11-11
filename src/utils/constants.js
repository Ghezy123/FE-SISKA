// Konstanta umum aplikasi SISKA (Sistem Informasi Stok dan Kasir — Alya Fotocopy)

export const APP_CONFIG = {
  NAME: 'SISKA',
  FULL_NAME: 'Sistem Informasi Stok dan Kasir',
  TAGLINE: 'Sistem Kasir & Inventori Alya Fotocopy',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
};

export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  OWNER: 'Super Admin',
  EMPLOYEE: 'Admin',
  KASIR: 'Admin',
};

export const isSuperAdminRole = (role) => {
  const r = String(role || '').toLowerCase();
  return r === 'super admin' || r === 'superadmin' || r === 'owner' || r === 'administrator';
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'siska_token',
  CSRF_TOKEN: 'siska_csrf_token',
  USER_DATA: 'siska_user',
};
