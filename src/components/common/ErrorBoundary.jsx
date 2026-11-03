import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SISKA ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    if (window.confirm('Reset data sistem SISKA ke pengaturan default? Data transaksi dan perubahan stok lokal akan di-refresh.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'Inter, -apple-system, sans-serif',
          background: '#f8fafc',
          padding: '24px',
          color: '#1e293b',
          textAlign: 'center',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '36px 32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'grid',
              placeItems: 'center',
              fontSize: '28px',
              margin: '0 auto 16px',
            }}>
              ⚠
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px', color: '#0f172a' }}>
              Terjadi Kendala Sistem
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>
              Aplikasi mendeteksi error tak terduga. Anda dapat memuat ulang halaman atau memulihkan data default.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleResetStorage}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Pulihkan Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

