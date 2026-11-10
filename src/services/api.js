import { APP_CONFIG, STORAGE_KEYS } from '../utils/constants';

/**
 * HTTP Client Wrapper (Fetch-based) untuk integrasi FE-SISKA <-> BE-SISKA
 * Mendukung Express Session Cookie (credentials: 'include') + Synchronizer CSRF Token (X-CSRF-Token)
 */
class ApiService {
  constructor(baseUrl = APP_CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  getCsrfToken() {
    return localStorage.getItem(STORAGE_KEYS.CSRF_TOKEN) || '';
  }

  setCsrfToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token);
    }
  }

  getHeaders(method = 'GET', extraHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extraHeaders,
    };

    const csrfToken = this.getCsrfToken();
    const upperMethod = String(method).toUpperCase();
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(upperMethod)) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;
    const method = options.method || 'GET';

    const config = {
      ...options,
      method,
      credentials: 'include', // Wajib agar cookie HttpOnly siska.sid dikirim otomatis
      headers: this.getHeaders(method, options.headers),
    };

    const response = await fetch(url, config);

    // Simpan token CSRF terbaru jika dikirim melalui header X-CSRF-Token
    const headerCsrf = response.headers.get('X-CSRF-Token') || response.headers.get('x-csrf-token');
    if (headerCsrf) {
      this.setCsrfToken(headerCsrf);
    }

    if (response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }

    const data = await response.json().catch(() => ({}));

    if (data?.data?.csrf_token) {
      this.setCsrfToken(data.data.csrf_token);
    }

    if (!response.ok) {
      const error = new Error(data.message || 'Terjadi kesalahan pada server');
      error.status = response.status;
      error.error_code = data.error_code;
      error.errors = data.errors;
      throw error;
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiService();
