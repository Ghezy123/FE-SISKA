import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import './StokModals.css';

/**
 * Modal Update Stok (Restok) — Figma frame 6:9711
 * Fields: Stok Awal (readonly), Stok yang Ditambah
 * Confirm pop-up 6:10360 is baked-in via confirmStep
 */
const ModalUpdateStok = ({ product, onClose, onSave }) => {
  const { warning } = useToast();
  const [tambah, setTambah] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    const qty = Number(tambah);
    if (!tambah || isNaN(qty) || qty <= 0) {
      warning('Masukkan jumlah stok yang valid (lebih dari 0)');
      return;
    }
    setConfirmStep(true);
  };

  const handleSave = () => {
    onSave(product, Number(tambah), 'Restok barang masuk');
  };

  if (confirmStep) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-dialog-body">
            <div className="confirm-icon" style={{ background: '#baced7ff' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <h2 className="confirm-dialog-title">Simpan Update Stok?</h2>
            <p className="confirm-dialog-sub">
              Stok <strong>{product.nama}</strong> akan bertambah <strong>+{tambah} {product.satuan || 'unit'}</strong> (Total: {product.stok + Number(tambah)}).
            </p>
          </div>
          <div className="modal-footer modal-footer-center">
            <div className="update-choice-group">
              <button className="btn-batal" style={{ flex: 1 }} onClick={() => setConfirmStep(false)}>Batal</button>
              <button className="btn-simpan" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Simpan
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
            <span className="modal-eyebrow">UPDATE</span>
            <h2 className="modal-title">Update Stok</h2>
            <p className="modal-subtitle">Perbarui jumlah barang di bawah ini.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleNext}>
          <div className="modal-body">
            <div className="modal-body-row">
              <div className="form-field">
                <label className="form-label">Stok Awal</label>
                <input
                  className="form-input"
                  type="number"
                  value={product.stok}
                  disabled
                  readOnly
                />
              </div>
              <div className="form-field">
                <label className="form-label">Stok Ditambah</label>
                <input
                  className="form-input"
                  type="number"
                  value={tambah}
                  onChange={(e) => setTambah(e.target.value)}
                  placeholder="500"
                  min="1"
                  required
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-batal" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-simpan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUpdateStok;
