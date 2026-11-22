import React, { useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import CurrencyInput from '../common/CurrencyInput';
import './StokModals.css';

/**
 * Modal Koreksi Stok (Stock Adjustment / Penyesuaian Salah Input)
 * Digunakan saat kasir/admin salah input stok atau ada selisih stok fisik nyata.
 */
const ModalKoreksiStok = ({ product, onClose, onSave }) => {
  const { warning } = useToast();
  const [stokFisik, setStokFisik] = useState(String(product?.stok ?? 0));
  const [alasanKategori, setAlasanKategori] = useState('Salah input data sebelumnya');
  const [catatanKhusus, setCatatanKhusus] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stokSaatIni = Number(product?.stok ?? 0);
  const stokBaru = stokFisik === '' ? 0 : Number(stokFisik);
  const selisih = stokBaru - stokSaatIni;
  const satuan = product?.satuan || 'Pcs';

  const alasanOptions = [
    'Salah input data sebelumnya',
    'Barang rusak / cacat fisik',
    'Selisih hasil stock opname',
    'Barang hilang / susut',
    'Koreksi lainnya',
  ];

  const handleNext = (e) => {
    e.preventDefault();
    if (stokFisik === '' || isNaN(stokBaru) || stokBaru < 0) {
      warning('Masukkan jumlah stok fisik yang valid (minimal 0)');
      return;
    }
    if (selisih === 0) {
      warning('Stok fisik yang dimasukkan sama dengan stok saat ini. Tidak ada perubahan.');
      return;
    }
    setConfirmStep(true);
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const finalCatatan = catatanKhusus.trim()
        ? `[${alasanKategori}] ${catatanKhusus.trim()} (Koreksi dari ${stokSaatIni} ke ${stokBaru} ${satuan})`
        : `[${alasanKategori}] Koreksi dari ${stokSaatIni} ke ${stokBaru} ${satuan}`;

      await onSave(product, selisih, finalCatatan);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmStep) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-dialog-body">
            <div
              className="confirm-icon"
              style={{
                background: selisih < 0 ? '#fee2e2' : '#fef3c7',
                color: selisih < 0 ? '#dc2626' : '#d97706',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="confirm-dialog-title">Konfirmasi Koreksi Stok</h2>
            <p className="confirm-dialog-sub">
              Stok <strong>{product.nama}</strong> akan disesuaikan:<br />
              Dari <strong>{stokSaatIni} {satuan}</strong> menjadi <strong>{stokBaru} {satuan}</strong>.<br />
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  fontWeight: 700,
                  color: selisih < 0 ? '#dc2626' : '#16a34a',
                }}
              >
                Selisih: {selisih > 0 ? `+${selisih}` : selisih} {satuan}
              </span>
            </p>
            <div
              style={{
                background: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#475569',
                marginTop: '12px',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'left',
              }}
            >
              <strong>Alasan:</strong> {alasanKategori}
              {catatanKhusus.trim() && (
                <div><strong>Keterangan:</strong> {catatanKhusus.trim()}</div>
              )}
            </div>
          </div>
          <div className="modal-footer modal-footer-center">
            <div className="update-choice-group">
              <button type="button" className="btn-batal" style={{ flex: 1 }} onClick={() => setConfirmStep(false)} disabled={isSubmitting}>
                Kembali
              </button>
              <button
                type="button"
                className="btn-simpan"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  background: selisih < 0 ? '#dc2626' : '#2563eb',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onClick={handleSave}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {isSubmitting ? 'Mengoreksi...' : 'Ya, Koreksi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">MANAJEMEN STOK • KOREKSI</span>
            <h2 className="modal-title">Koreksi Stok Fisik</h2>
            <p className="modal-subtitle">
              Gunakan fitur ini jika terjadi salah input stok sebelumnya atau selisih fisik nyata.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNext}>
          <div className="modal-body">
            {/* Info Produk Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  {product?.kode || 'BARANG'} • {product?.kategori}
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  {product?.nama}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Stok di Sistem</span>
                <strong style={{ fontSize: '16px', color: '#2563eb' }}>
                  {stokSaatIni} {satuan}
                </strong>
              </div>
            </div>

            {/* Input Stok Fisik Sebenarnya */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-stok-fisik">
                Stok Fisik Sebenarnya <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <CurrencyInput
                  id="input-stok-fisik"
                  value={stokFisik}
                  onChange={(val) => setStokFisik(val)}
                  placeholder="0"
                  min={0}
                  className="form-input"
                  style={{ paddingRight: '56px', fontSize: '16px', fontWeight: 700 }}
                  autoFocus
                />
                <span
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 600,
                    pointerEvents: 'none',
                  }}
                >
                  {satuan}
                </span>
              </div>
            </div>

            {/* Dynamic Selisih Preview Box */}
            <div
              style={{
                marginTop: '12px',
                marginBottom: '16px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: selisih === 0 ? '#f1f5f9' : selisih < 0 ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${selisih === 0 ? '#e2e8f0' : selisih < 0 ? '#fecaca' : '#bbf7d0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
              }}
            >
              <span style={{ color: selisih === 0 ? '#64748b' : selisih < 0 ? '#991b1b' : '#166534', fontWeight: 600 }}>
                {selisih === 0
                  ? 'Tidak ada perubahan stok'
                  : selisih < 0
                  ? 'Penyesuaian (Pengurangan Stok)'
                  : 'Penyesuaian (Penambahan Stok)'}
              </span>
              <strong
                style={{
                  fontSize: '15px',
                  color: selisih === 0 ? '#64748b' : selisih < 0 ? '#dc2626' : '#16a34a',
                }}
              >
                {selisih > 0 ? `+${selisih}` : selisih} {satuan}
              </strong>
            </div>

            {/* Alasan Koreksi */}
            <div className="form-group">
              <label className="form-label" htmlFor="select-alasan-koreksi">
                Alasan Koreksi <span className="required">*</span>
              </label>
              <select
                id="select-alasan-koreksi"
                className="form-input"
                value={alasanKategori}
                onChange={(e) => setAlasanKategori(e.target.value)}
                style={{ cursor: 'pointer', appearance: 'auto' }}
              >
                {alasanOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Keterangan Tambahan (Opsional) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="catatan-tambahan">
                Keterangan Tambahan <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Opsional)</span>
              </label>
              <input
                id="catatan-tambahan"
                type="text"
                className="form-input"
                placeholder="Contoh: Salah ketik pas tambah barang baru, dll."
                value={catatanKhusus}
                onChange={(e) => setCatatanKhusus(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-batal" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn-simpan"
              disabled={selisih === 0}
              style={{
                opacity: selisih === 0 ? 0.6 : 1,
                cursor: selisih === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalKoreksiStok;
