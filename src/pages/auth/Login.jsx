import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

export const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username wajib diisi');
      return;
    }
    if (!password.trim()) {
      setError('Password wajib diisi');
      return;
    }

    setIsLoading(true);
    try {
      await login({ username, password });
    } catch (err) {
      setError(err.message || 'Gagal masuk. Silakan periksa kembali akun Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="figma-login-wrapper">
      <div className="figma-login-card">
        {/* Top Icon (Store / Register) */}
        <div className="figma-icon-container">
          <svg
            className="figma-store-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        {/* Header Typography */}
        <div className="figma-login-header">
          <span className="figma-login-badge">SISTEM KASIR & INVENTORI</span>
          <h1 className="figma-login-title">Masuk ke SISKA</h1>
          <p className="figma-login-subtitle">
            Silakan masukkan akun Anda untuk melanjutkan.
          </p>
        </div>

        {/* Error Alert */}
        {error && <div className="figma-alert-danger">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="figma-login-form">
          <div className="figma-form-field">
            <label htmlFor="username" className="figma-field-label">
              Username
            </label>
            <div className="figma-input-wrapper">
              <input
                id="username"
                type="text"
                className="figma-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="figma-form-field">
            <label htmlFor="password" className="figma-field-label">
              Password
            </label>
            <div className="figma-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="figma-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="figma-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="figma-submit-button"
          >
            <span>{isLoading ? 'Sedang Memproses...' : 'Masuk'}</span>
            <svg
              className="figma-arrow-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {/* Footer Text */}
        <p className="figma-login-footer">
          Butuh bantuan? Hubungi pemilik toko.
        </p>
      </div>
    </div>
  );
};
