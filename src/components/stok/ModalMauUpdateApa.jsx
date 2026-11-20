import React from 'react';
import './StokModals.css';

/**
 * Pop-up: "Mau Update Apa?" — pilih antara Restok, Koreksi Stok, atau Update Harga
 */
const ModalMauUpdateApa = ({ product, onClose, onUpdateHarga, onUpdateStok, onKoreksiStok }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
        {/* Icon & Title */}
        <div className="confirm-dialog-body" style={{ paddingBottom: '8px' }}>
          <div className="confirm-icon" style={{ background: '#dbeafe' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </div>
          <h2 className="confirm-dialog-title">Mau Update Apa?</h2>
          <p className="confirm-dialog-sub">
            Pilih jenis perubahan untuk barang <strong>{product?.nama}</strong>
          </p>
        </div>

        {/* Choices */}
        <div className="modal-footer modal-footer-center" style={{ paddingTop: 12 }}>
          <div className="update-choice-group update-choice-vertical">
            <button
              type="button"
              className="btn-choice-option"
              onClick={() => onUpdateStok(product)}
            >
              <span className="choice-option-title">+ Tambah Stok (Restok)</span>
              <span className="choice-option-desc">Catat penambahan barang masuk dari pembelian/supplier</span>
            </button>

            <button
              type="button"
              className="btn-choice-option btn-choice-koreksi"
              onClick={() => onKoreksiStok(product)}
            >
              <span className="choice-option-title" style={{ color: '#d97706' }}>
                ⚡ Koreksi Stok Fisik
              </span>
              <span className="choice-option-desc">Perbaiki salah input data awal atau selisih fisik</span>
            </button>

            <button
              type="button"
              className="btn-choice-option"
              onClick={() => onUpdateHarga(product)}
            >
              <span className="choice-option-title">🏷️ Update Harga &amp; Satuan</span>
              <span className="choice-option-desc">Ubah harga beli, harga jual, dan opsi satuan borongan</span>
            </button>

            <button
              type="button"
              className="btn-choice-cancel"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMauUpdateApa;
