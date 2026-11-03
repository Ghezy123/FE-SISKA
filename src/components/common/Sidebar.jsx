import { APP_CONFIG } from '../../utils/constants';

export const Sidebar = ({ activePage, onNavigate, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'mahasiswa', label: 'Data Mahasiswa', icon: '🎓' },
    { id: 'dosen', label: 'Data Dosen', icon: '👨‍🏫' },
    { id: 'krs', label: 'KRS & Nilai', icon: '📝' },
    { id: 'pengaturan', label: 'Pengaturan', icon: '⚙️' },
  ];

  return (
    <aside className={`siska-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="siska-sidebar-brand">
        <div className="siska-brand-logo">🎓</div>
        <div>
          <h2 className="siska-brand-title">{APP_CONFIG.NAME}</h2>
          <span className="siska-brand-sub">Portal Akademik</span>
        </div>
      </div>

      <nav className="siska-nav-menu">
        <div className="siska-menu-section-title">MENU UTAMA</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`siska-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="siska-nav-icon">{item.icon}</span>
            <span className="siska-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="siska-sidebar-footer">
        <small>Versi {APP_CONFIG.VERSION}</small>
      </div>
    </aside>
  );
};

