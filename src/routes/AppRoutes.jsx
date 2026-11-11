import { useState } from 'react';
import StokPage from '../pages/stok/StokPage';
import LaporanPage from '../pages/laporan/LaporanPage';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Login } from '../pages/auth/Login';
import { KasirPage } from '../pages/kasir/KasirPage';
import { AkunPage } from '../pages/akun/AkunPage';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatRupiah } from '../utils/helpers';
import { transaksiService } from '../services/transaksiService';
import { StrukThermal } from '../components/common/StrukThermal';
import CurrencyInput from '../components/common/CurrencyInput';
import { isSuperAdminRole } from '../utils/constants';

export const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { cartItems, totalAmount, totalItems, clearCart } = useCart();
  const { error: toastError } = useToast();
  const [currentPage, setCurrentPage] = useState('kasir');

  // Checkout modal states (Figma Frame 6:2328 & 6:3134)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [uangDiterima, setUangDiterima] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

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
    if (cartItems.length === 0) return;
    setUangDiterima(totalAmount);
    setPaymentSuccess(false);
    setShowCheckoutModal(true);
  };

  const cashReceivedNumber = Number(uangDiterima) || totalAmount;
  const kembalian = Math.max(0, cashReceivedNumber - totalAmount);

  const handleConfirmPayment = async () => {
    try {
      // Catat transaksi ke BE-SISKA (otomatis memvalidasi & mengurangi stok secara atomik)
      const tx = await transaksiService.tambah(
        cartItems,
        totalAmount,
        cashReceivedNumber,
        kembalian
      );

      // Simpan data transaksi untuk struk After Pembayaran
      setLastTransaction(tx);
      setPaymentSuccess(true);
    } catch (err) {
      toastError(err.message || 'Gagal memproses pembayaran transaksi');
    }
  };

  const handleCloseAfterPayment = () => {
    clearCart();
    setPaymentSuccess(false);
    setLastTransaction(null);
    setShowCheckoutModal(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'kasir':
        return <KasirPage />;
      case 'stok':
        return <StokPage />;
      case 'laporan':
        return <LaporanPage />;
      case 'akun':
        return isSuperAdminRole(user?.role) ? <AkunPage /> : <KasirPage />;
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

      {/* ── Modal Pembayaran & Struk (Figma 6:2328 & 6:3134) ── */}
      {showCheckoutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          fontFamily: 'Inter, sans-serif',
          padding: '16px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            maxWidth: paymentSuccess ? '460px' : '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}>
            {paymentSuccess ? (
              /* ── After Pembayaran: Struk Transaksi (Figma Frame 6:3134) ── */
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '32px',
                    margin: '0 auto 12px',
                  }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 6px' }}>
                    Transaksi Berhasil!
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                    Kembalian untuk pelanggan: <strong style={{ color: '#16a34a', fontSize: '16px' }}>{formatRupiah(kembalian)}</strong>
                  </p>
                </div>

                {/* Struk Card */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '18px',
                  marginBottom: '20px',
                  fontSize: '13px',
                }}>
                  <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '12px' }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>ALYA FOTOCOPY</h4>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#64748b' }}>Layanan Fotokopi, Jilid & ATK</p>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>
                      {lastTransaction ? new Date(lastTransaction.waktu).toLocaleString('id-ID') : '24 Jun 2024 • 14:32'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {lastTransaction?.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                        <span>{it.nama} × {it.qty}</span>
                        <strong style={{ color: '#0f172a' }}>{formatRupiah(it.subtotal || it.harga * it.qty)}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700' }}>
                    <span>Total</span>
                    <span style={{ color: '#2563eb' }}>{formatRupiah(totalAmount)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      flex: 1,
                      height: '46px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    Cetak Struk
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseAfterPayment}
                    style={{
                      flex: 1.3,
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
                    Transaksi Baru
                  </button>
                </div>

                {/* Struk POS Thermal Printable (Aktif saat tombol cetak ditekan) */}
                <StrukThermal transaction={lastTransaction} cashierName="Petugas Toko" />
              </div>
            ) : (
              /* ── Step 1: Input Pembayaran (Figma Frame 6:2328) ── */
              <>
                <div style={{ marginBottom: '18px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb', letterSpacing: '0.06em' }}>
                    LANGKAH TERAKHIR
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '4px 0 0', color: '#111827' }}>
                    Pembayaran
                  </h3>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '18px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                    <span>Total Belanja ({totalItems} barang)</span>
                    <strong style={{ color: '#0f172a', fontSize: '16px' }}>{formatRupiah(totalAmount)}</strong>
                  </div>
                </div>

                {/* Input Uang Diterima */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Uang Diterima
                  </label>
                  <CurrencyInput
                    value={uangDiterima}
                    onChange={(raw) => setUangDiterima(raw)}
                    placeholder="Masukkan nominal uang"
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  {/* Quick cash pills */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    {[totalAmount, 20000, 50000, 100000].map((amt, idx) => {
                      if (amt < totalAmount && idx !== 0) return null;
                      const label = idx === 0 ? 'Uang Pas' : formatRupiah(amt);
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setUangDiterima(amt)}
                          style={{
                            padding: '6px 10px',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Kembalian box */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: cashReceivedNumber < totalAmount ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${cashReceivedNumber < totalAmount ? '#fecaca' : '#bbf7d0'}`,
                  marginBottom: '22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '13px', color: cashReceivedNumber < totalAmount ? '#991b1b' : '#166534', fontWeight: '600' }}>
                    {cashReceivedNumber < totalAmount ? 'Uang Kurang' : 'Kembalian'}
                  </span>
                  <strong style={{ fontSize: '18px', color: cashReceivedNumber < totalAmount ? '#dc2626' : '#16a34a' }}>
                    {cashReceivedNumber < totalAmount ? formatRupiah(totalAmount - cashReceivedNumber) : formatRupiah(kembalian)}
                  </strong>
                </div>

                {/* Actions */}
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
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={cashReceivedNumber < totalAmount}
                    onClick={handleConfirmPayment}
                    style={{
                      flex: 2,
                      height: '46px',
                      borderRadius: '10px',
                      border: 'none',
                      background: cashReceivedNumber < totalAmount ? '#94a3b8' : '#2563eb',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: cashReceivedNumber < totalAmount ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                    }}
                  >
                    Selesaikan Transaksi
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
