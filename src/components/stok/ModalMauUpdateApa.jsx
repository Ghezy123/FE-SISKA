import React from 'react';
import './StokModals.css';

/**
 * Pop-up: "Mau Update Apa?" — pilih antara Update Stok atau Update Harga
 * Figma frame 6:9060
 */
const ModalMauUpdateApa = ({ product, onClose, onUpdateHarga, onUpdateStok }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className="confirm-dialog-body">
          <div className="confirm-icon" style={{ background: '#baced7ff' }}>
            {/* pencil icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </div>
          <h2 className="confirm-dialog-title">Mau Update Apa?</h2>
        </div>

        {/* Footer */}
        <div className="modal-footer modal-footer-center" style={{ paddingTop: 16 }}>
          <div className="update-choice-group">
            <button className="btn-choice" onClick={() => onUpdateStok(product)}>
              Update Stok
            </button>
            <button className="btn-choice" onClick={() => onUpdateHarga(product)}>
              Update Harga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMauUpdateApa;

