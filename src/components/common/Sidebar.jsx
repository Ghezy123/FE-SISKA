import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

export const Sidebar = ({ activePage, onNavigate, isOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'kasir',
      label: 'Kasir',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      id: 'stok',
      label: 'Stok',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      id: 'laporan',
      label: 'Laporan',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <aside className={`siska-sidebar-v2 ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="siska-brand-header">
        <div className="siska-brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="siska-brand-text">
          <h2 className="siska-brand-name">SISKA</h2>
          <span className="siska-brand-desc">Kasir & Inventori</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="siska-nav-section">
        <span className="siska-section-label">MENU UTAMA</span>
        <div className="siska-menu-list">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`siska-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="siska-nav-btn-icon">{item.icon}</span>
                <span className="siska-nav-btn-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout at bottom */}
      <div className="siska-sidebar-bottom">
        <div className="siska-user-card">
          <div className="siska-user-avatar">
            {user?.nama ? user.nama.slice(0, 2).toUpperCase() : 'AR'}
          </div>
          <div className="siska-user-details">
            <span className="siska-user-fullname">{user?.nama || 'Admin Toko'}</span>
            <span className="siska-user-tag">{user?.role === 'admin' ? 'Pemilik' : 'Kasir'}</span>
          </div>
        </div>

        <button type="button" className="siska-logout-btn" onClick={logout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
