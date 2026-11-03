import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import { Button } from './Button';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="siska-navbar">
      <div className="siska-navbar-left">
        <button
          type="button"
          className="siska-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
        <span className="siska-navbar-page-title">Sistem Informasi Akademik</span>
      </div>

      <div className="siska-navbar-right">
        {user ? (
          <div className="siska-user-profile">
            <div className="siska-avatar">{getInitials(user.nama || 'Admin')}</div>
            <div className="siska-user-info">
              <span className="siska-user-name">{user.nama}</span>
              <span className="siska-user-role">{user.role?.toUpperCase()}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Keluar
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

