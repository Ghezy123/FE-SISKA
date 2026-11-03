import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';

export const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
    <form onSubmit={handleSubmit} className="siska-form">
      <h2>Masuk ke Akun</h2>
      <p className="siska-form-desc">Gunakan kredensial akademik Anda untuk melanjutkan</p>

      {error && <div className="siska-alert-danger">{error}</div>}

      <div className="siska-form-group">
        <label htmlFor="username">Username / NIM / NIP</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username"
          required
        />
      </div>

      <div className="siska-form-group">
        <label htmlFor="password">Kata Sandi</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan kata sandi"
          required
        />
      </div>

      <Button type="submit" variant="primary" disabled={isLoading} className="siska-btn-full">
        {isLoading ? 'Sedang Memproses...' : 'Masuk'}
      </Button>
    </form>
  );
};

