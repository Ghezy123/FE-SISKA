import React from 'react';
import './StokModals.css';

/**
 * Modal Konfirmasi Hapus — Figma frame 6:8720
 * Icon: red trash, title "Yakin Hapus Barang?", desc with product name
 */
const ModalKonfirmasiHapus = ({ product, onClose, onHapus }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
        {/* Icon + text */}
        <div className="confirm-dialog-body">
          <div className="confirm-icon" style={{ background: '#fee2e2' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
            </svg>
          </div>
          <h2 className="confirm-dialog-title">Yakin Hapus Barang?</h2>
          <p className="confirm-dialog-sub">
            Anda akan menghapus <strong>{product.nama}</strong>. Data tidak dapat dikembalikan.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer modal-footer-center" style={{ paddingTop: 16 }}>
          <div className="update-choice-group">
            <button className="btn-batal" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button
              className="btn-hapus-confirm"
              style={{ flex: 1, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={() => onHapus(product)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M10 11v6" /><path d="M14 11v6" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalKonfirmasiHapus;

