import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Login } from '../pages/auth/Login';
import { KasirPage } from '../pages/kasir/KasirPage';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/helpers';

export const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  const { totalAmount, totalItems, clearCart } = useCart();
  const [currentPage, setCurrentPage] = useState('kasir');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <p>Memuat sistem SISKA...</p>
      </div>
    );
  }

  // Jika belum login, tampilkan Login Screen Frame 6:2
  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Login />
      </AuthLayout>
    );
  }

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      clearCart();
      setPaymentSuccess(false);
      setShowCheckoutModal(false);
    }, 1800);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'kasir':
        return <KasirPage />;
      case 'stok':
        return (
          <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Modul Stok</h1>
            <p style={{ color: '#6b7280' }}>Manajemen inventori barang dan update harga.</p>
          </div>
        );
      case 'laporan':
        return (
          <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Modul Laporan</h1>
            <p style={{ color: '#6b7280' }}>Laporan rekapitulasi penjualan dan kasir harian.</p>
          </div>
        );
      default:
        return <KasirPage />;
    }
  };

  return (
    <>
      <MainLayout
        activePage={currentPage}
        onNavigate={setCurrentPage}
        onCheckout={handleCheckout}
      >
        {renderCurrentPage()}
      </MainLayout>

      {/* Modal Pembayaran Cepat */}
      {showCheckoutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          fontFamily: 'Inter, sans-serif',
          padding: '16px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '420px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
          }}>
            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '28px',
                  margin: '0 auto 16px',
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>Pembayaran Berhasil!</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Struk transaksi kasir sedang dicetak...</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>Konfirmasi Pembayaran</h3>
                <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px' }}>
                  Total {totalItems} barang siap dibayarkan.
                </p>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                    <span>Metode Pembayaran</span>
                    <strong style={{ color: '#0f172a' }}>Tunai (Cash)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#0f172a', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                    <span>Total Tagihan</span>
                    <span style={{ color: '#2563eb' }}>{formatRupiah(totalAmount)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    style={{
                      flex: 1,
                      height: '46px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    style={{
                      flex: 2,
                      height: '46px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#2563eb',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                    }}
                  >
                    Bayar Lunas
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
