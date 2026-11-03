// Konstanta umum aplikasi SISKA

export const APP_CONFIG = {
  NAME: 'SISKA',
  FULL_NAME: 'Sistem Informasi Akademik',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  DOSEN: 'dosen',
  MAHASISWA: 'mahasiswa',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'siska_token',
  USER_DATA: 'siska_user',
};

