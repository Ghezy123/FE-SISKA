import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { MahasiswaList } from '../pages/mahasiswa/MahasiswaList';
import { Card } from '../components/common/Card';

/**
 * AppRoutes Component
 * 
 * Pengatur alur halaman (State-driven & siap dimigrasikan ke react-router-dom).
 * Begitu paket 'react-router-dom' diinstal, Anda bisa dengan mudah mengganti
 * switch case ini dengan <Routes> dan <Route path="..." element={...} />.
 */
export const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <p>Memuat sistem SISKA...</p>
      </div>
    );
  }

  // Jika belum login, arahkan ke AuthLayout + Login
  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Login />
      </AuthLayout>
    );
  }

  // Render halaman sesuai activePage
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'mahasiswa':
        return <MahasiswaList />;
      case 'dosen':
        return (
          <div className="siska-page">
            <h1 className="siska-page-title">Data Dosen</h1>
            <Card title="Modul Dosen">
              <p>Halaman manajemen data dosen pengampu mata kuliah.</p>
            </Card>
          </div>
        );
      case 'krs':
        return (
          <div className="siska-page">
            <h1 className="siska-page-title">Kartu Rencana Studi (KRS) & Nilai</h1>
            <Card title="Persetujuan KRS">
              <p>Halaman verifikasi KRS mahasiswa semester aktif.</p>
            </Card>
          </div>
        );
      case 'pengaturan':
        return (
          <div className="siska-page">
            <h1 className="siska-page-title">Pengaturan Sistem</h1>
            <Card title="Konfigurasi Akademik">
              <p>Pengaturan tahun ajaran, semester aktif, dan kuota kelas.</p>
            </Card>
          </div>
        );
      default:
        return (
          <div className="siska-page">
            <h2>404 - Halaman Tidak Ditemukan</h2>
            <button onClick={() => setCurrentPage('dashboard')}>Kembali ke Dashboard</button>
          </div>
        );
    }
  };

  return (
    <MainLayout activePage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </MainLayout>
  );
};

