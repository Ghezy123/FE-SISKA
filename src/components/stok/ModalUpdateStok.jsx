import React, { useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import CurrencyInput from '../common/CurrencyInput';
import './StokModals.css';

/**
 * Modal Update Stok (Restok) — Mendukung pilihan opsi dari ke-3 tingkatan satuan
 */
const ModalUpdateStok = ({ product, onClose, onSave }) => {
  const { warning } = useToast();
  const [tambah, setTambah] = useState('');
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [confirmStep, setConfirmStep] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Ambil opsi satuan yang dimiliki barang (Tier 1 Ecer, Tier 2 Sedang, Tier 3 Grosir)
  const availableUnits = useMemo(() => {
    if (product.satuan_opsi && product.satuan_opsi.length > 0) {
      return product.satuan_opsi;
    }
    return [
      {
        nama: product.satuan || 'Pcs',
        namaSatuan: product.satuan || 'Pcs',
        pengali: 1,
        label: `Ecer (${product.satuan || 'Pcs'})`,
      },
    ];
  }, [product]);

  const selectedTier = availableUnits[selectedUnitIdx] || availableUnits[0];
  const multiplier = Number(selectedTier.pengali) || 1;
  const qtyInput = Number(tambah) || 0;
  const physicalAdded = qtyInput * multiplier;
  const newTotalStock = product.stok + physicalAdded;
  const tierName = selectedTier.namaSatuan || selectedTier.nama?.split(' ')[0] || product.satuan || 'Pcs';

  // Cek apakah user sudah mengisi jumlah restok
  const isDirty = useMemo(() => {
    return Boolean(tambah && Number(tambah) > 0);
  }, [tambah]);

  const handleRequestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!tambah || isNaN(qtyInput) || qtyInput <= 0) {
      warning('Masukkan jumlah stok yang valid (lebih dari 0)');
      return;
    }
    setConfirmStep(true);
  };

  const handleSave = () => {
    const catatan = `Restok +${qtyInput} ${tierName} (${physicalAdded} ${product.satuan || 'unit'})`;
    onSave(product, physicalAdded, catatan);
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
              Stok <strong>{product.nama}</strong> akan bertambah <strong>+{qtyInput} {tierName}</strong> (setara <strong>+{physicalAdded.toLocaleString('id-ID')} {product.satuan || 'Pcs'}</strong>).<br />
              Total stok akhir menjadi: <strong>{newTotalStock.toLocaleString('id-ID')} {product.satuan || 'Pcs'}</strong>.
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
    <div className="modal-backdrop" onClick={handleRequestClose}>
      <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">UPDATE</span>
            <h2 className="modal-title">Update Stok (Restok)</h2>
            <p className="modal-subtitle">Tambah stok dalam pilihan satuan ecer atau kemasan borongan.</p>
          </div>
          <button className="modal-close-btn" onClick={handleRequestClose} aria-label="Tutup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleNext}>
          <div className="modal-body">
            {/* Stok Saat Ini */}
            <div className="form-field">
              <label className="form-label">Stok Fisik Saat Ini (Satuan Master)</label>
              <input
                className="form-input"
                type="text"
                value={`${(product.stok || 0).toLocaleString('id-ID')} ${product.satuan || 'Pcs'}`}
                disabled
                readOnly
              />
            </div>

            {/* Pilihan Opsi Satuan Penambahan */}
            {availableUnits.length > 1 && (
              <div className="form-field">
                <label className="form-label">Pilih Satuan Penambahan Stok</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {availableUnits.map((u, idx) => {
                    const isSelected = selectedUnitIdx === idx;
                    const uName = u.namaSatuan || u.nama?.split(' ')[0] || u.nama;
                    return (
                      <button
                        key={u.nama}
                        type="button"
                        className={`siska-card-unit-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedUnitIdx(idx)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        {uName} {u.pengali > 1 ? `(isi ${u.pengali})` : '(Ecer)'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Jumlah Ditambah — menggunakan CurrencyInput agar tampil dengan titik ribuan */}
            <div className="form-field">
              <label className="form-label">Jumlah {tierName} yang Ditambah</label>
              <CurrencyInput
                className="form-input"
                min={1}
                value={tambah}
                onChange={(raw) => setTambah(raw)}
                placeholder="Contoh: 2"
                required
                autoFocus
              />
            </div>

            {/* Live Calculation Preview */}
            {qtyInput > 0 && (
              <div className="stock-calc-preview">
                <span className="stock-calc-preview-text">
                  Tambah <strong>+{qtyInput} {tierName}</strong>:
                </span>
                <span className="stock-calc-preview-badge">
                  = +{physicalAdded.toLocaleString('id-ID')} {product.satuan || 'Pcs'}
                </span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-batal" onClick={handleRequestClose}>Batal</button>
            <button type="submit" className="btn-simpan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Simpan Stok
            </button>
          </div>
        </form>
      </div>

      {/* Modal Validasi Batalkan jika jumlah restok sudah diisi */}
      {showDiscardConfirm && (
        <div className="modal-backdrop" style={{ zIndex: 300 }} onClick={() => setShowDiscardConfirm(false)}>
          <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-body">
              <div className="confirm-icon" style={{ background: '#fef3c7' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 className="confirm-dialog-title">Batalkan Update Stok?</h2>
              <p className="confirm-dialog-sub">
                Jumlah stok yang Anda masukkan belum disimpan. Apakah Anda yakin ingin membatalkan?
              </p>
            </div>
            <div className="modal-footer modal-footer-center" style={{ paddingTop: 16 }}>
              <div className="update-choice-group">
                <button
                  type="button"
                  className="btn-batal"
                  style={{ flex: 1 }}
                  onClick={() => setShowDiscardConfirm(false)}
                >
                  Lanjut Mengisi
                </button>
                <button
                  type="button"
                  className="btn-hapus-confirm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={onClose}
                >
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalUpdateStok;
