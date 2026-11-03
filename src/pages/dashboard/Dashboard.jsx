import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Mahasiswa Aktif', value: '1.240', change: '+5% tahun ini', icon: '👨‍🎓', color: '#3b82f6' },
    { title: 'Dosen Pembimbing', value: '86', change: '8 prodi aktif', icon: '👨‍🏫', color: '#10b981' },
    { title: 'Mata Kuliah Semester Ini', value: '142', change: 'Semester Ganjil 2026/2027', icon: '📚', color: '#f59e0b' },
    { title: 'Pengajuan KRS Menunggu', value: '18', change: 'Perlu verifikasi', icon: '⏳', color: '#ef4444' },
  ];

  return (
    <div className="siska-page">
      <div className="siska-page-header">
        <div>
          <h1 className="siska-page-title">Selamat Datang, {user?.nama || 'Pengguna'}!</h1>
          <p className="siska-page-desc">
            Panel ringkasan aktivitas akademik Sistem Informasi Akademik (SISKA).
          </p>
        </div>
      </div>

      {/* Grid Statistik Ringkas */}
      <div className="siska-stats-grid">
        {stats.map((item, idx) => (
          <div key={idx} className="siska-stat-card">
            <div className="siska-stat-icon">{item.icon}</div>
            <div className="siska-stat-content">
              <span className="siska-stat-label">{item.title}</span>
              <span className="siska-stat-value">{item.value}</span>
              <span className="siska-stat-badge">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="siska-dashboard-panels">
        <Card
          title="Aksi Cepat"
          subtitle="Akses cepat modul administrasi yang sering digunakan"
        >
          <div className="siska-quick-actions">
            <button
              type="button"
              className="siska-quick-btn"
              onClick={() => onNavigate('mahasiswa')}
            >
              <span>🎓</span> Kelola Mahasiswa
            </button>
            <button
              type="button"
              className="siska-quick-btn"
              onClick={() => onNavigate('krs')}
            >
              <span>📝</span> Verifikasi KRS
            </button>
            <button
              type="button"
              className="siska-quick-btn"
              onClick={() => onNavigate('pengaturan')}
            >
              <span>⚙️</span> Konfigurasi Semester
            </button>
          </div>
        </Card>

        <Card
          title="Pengumuman Akademik Terkini"
          subtitle="Jadwal penting semester berjalan"
        >
          <ul className="siska-announcements">
            <li>
              <strong>Batas Akhir Pengisian KRS Online:</strong> 15 November 2026
            </li>
            <li>
              <strong>Periode Input Nilai UTS:</strong> 20 - 30 November 2026
            </li>
            <li>
              <strong>Pengajuan Cuti Akademik:</strong> Maksimal minggu ke-4 perkuliahan
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

