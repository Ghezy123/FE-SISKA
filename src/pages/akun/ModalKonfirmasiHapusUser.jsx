import React, { useState } from 'react';

export const ModalKonfirmasiHapusUser = ({ isOpen, onClose, onConfirm, user }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm(user);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="siska-modal-backdrop" onClick={onClose}>
      <div className="siska-modal-delete-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Red Circle Trash Icon */}
        <div className="siska-delete-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <h3 className="siska-delete-title">Yakin Hapus Akun?</h3>
        <p className="siska-delete-sub">
          Akun <strong>{user.nama}</strong> (@{user.username}) tidak akan bisa mengakses sistem lagi.
        </p>

        <div className="siska-delete-actions">
          <button type="button" className="siska-btn-modal-cancel" onClick={onClose} disabled={isDeleting}>
            Batal
          </button>
          <button
            type="button"
            className="siska-btn-modal-danger"
            disabled={isDeleting}
            style={{ opacity: isDeleting ? 0.7 : 1 }}
            onClick={handleConfirm}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

