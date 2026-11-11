import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export const ModalUserForm = ({ isOpen, onClose, onSave, initialData }) => {
  const { warning } = useToast();
  const isEdit = Boolean(initialData);

  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama || initialData.nama_lengkap || '');
      setUsername(initialData.username || '');
      setPassword('');
      setRole(initialData.role || 'Admin');
    } else {
      setNama('');
      setUsername('');
      setPassword('');
      setRole('Admin');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanNama = nama.trim();
    const cleanUsername = username.trim().replace(/^@/, '');

    if (!cleanNama) {
      warning('Nama lengkap wajib diisi');
      return;
    }

    if (!cleanUsername) {
      warning('Username wajib diisi');
      return;
    }

    if (!isEdit && !password.trim()) {
      warning('Password wajib diisi untuk akun baru');
      return;
    }

    if (!role) {
      warning('Pilih role pengguna');
      return;
    }

    onSave({
      id: initialData?.id,
      nama: cleanNama,
      username: cleanUsername,
      password: password.trim() || undefined,
      role,
    });

    onClose();
  };

  return (
    <div className="siska-modal-backdrop" onClick={onClose}>
      <div className="siska-user-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="siska-user-modal-header">
          <div>
            <span className="siska-user-modal-eyebrow">DATA PENGGUNA</span>
            <h2 className="siska-user-modal-title">
              {isEdit ? 'Update Akun' : 'Tambah Akun'}
            </h2>
            <p className="siska-user-modal-sub">
              Isi data akun dan tentukan hak akses pengguna.
            </p>
          </div>
          <button type="button" className="siska-modal-close-icon" onClick={onClose} aria-label="Tutup">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="siska-user-modal-body">
            {/* Nama Lengkap */}
            <div className="siska-form-group">
              <label className="siska-form-label">Nama Lengkap</label>
              <input
                type="text"
                className="siska-form-input"
                placeholder="Contoh: Budi Santoso"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Username */}
            <div className="siska-form-group">
              <label className="siska-form-label">Username</label>
              <input
                type="text"
                className="siska-form-input"
                placeholder="Contoh: budi.admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="siska-form-group">
              <label className="siska-form-label">
                Password
                {isEdit && (
                  <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'normal', marginLeft: '6px' }}>
                    (Kosongkan jika tidak ingin mengubah)
                  </span>
                )}
              </label>
              <input
                type="password"
                className="siska-form-input"
                placeholder={isEdit ? 'Masukkan password baru (opsional)' : 'Masukkan password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isEdit}
              />
            </div>

            {/* Role */}
            <div className="siska-form-group">
              <label className="siska-form-label">Role</label>
              <select
                className="siska-form-select siska-form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>Pilih role pengguna</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="siska-user-modal-footer">
            <button type="button" className="siska-btn-modal-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="siska-btn-modal-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

