import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { ModalUserForm } from './ModalUserForm';
import { ModalKonfirmasiHapusUser } from './ModalKonfirmasiHapusUser';
import './AkunPage.css';

export const AkunPage = () => {
  const { user: currentUser } = useAuth();
  const { success, warning, error: toastError } = useToast();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modalForm, setModalForm] = useState({ isOpen: false, data: null });
  const [modalDelete, setModalDelete] = useState({ isOpen: false, user: null });

  const loadUsers = () => {
    setUsers(userService.getUsers());
  };

  useEffect(() => {
    loadUsers();
    userService.syncFromBackend();

    const handleUpdate = () => loadUsers();
    window.addEventListener('siska_users_updated', handleUpdate);

    return () => {
      window.removeEventListener('siska_users_updated', handleUpdate);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.nama && u.nama.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q))
    );
  }, [users, search]);

  const handleOpenTambah = () => {
    setModalForm({ isOpen: true, data: null });
  };

  const handleOpenUpdate = (targetUser) => {
    setModalForm({ isOpen: true, data: targetUser });
  };

  const handleOpenDelete = (targetUser) => {
    if (
      String(targetUser.id) === String(currentUser?.id) ||
      (currentUser?.username && targetUser.username.toLowerCase() === currentUser.username.toLowerCase())
    ) {
      warning('Anda tidak dapat menghapus akun yang sedang digunakan');
      return;
    }
    setModalDelete({ isOpen: true, user: targetUser });
  };

  const handleSaveUser = async (formData) => {
    try {
      if (formData.id) {
        await userService.updateUser(formData.id, formData);
        success(`Akun "${formData.nama}" berhasil diperbarui`);
      } else {
        await userService.createUser(formData);
        success(`Akun baru "${formData.nama}" berhasil ditambahkan`);
      }
      loadUsers();
    } catch (err) {
      toastError(err.message || 'Gagal menyimpan data akun');
    }
  };

  const handleConfirmDelete = async (targetUser) => {
    try {
      await userService.deleteUser(targetUser.id);
      success(`Akun "${targetUser.nama}" berhasil dihapus`);
      loadUsers();
    } catch (err) {
      toastError(err.message || 'Gagal menghapus akun');
    }
  };

  const getInitials = (nama) => {
    if (!nama) return 'US';
    const parts = nama.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nama.slice(0, 2).toUpperCase();
  };

  return (
    <div className="siska-akun-page">
      {/* ── Header ── */}
      <header className="siska-akun-header">
        <span className="siska-akun-eyebrow">ADMINISTRASI SISTEM</span>
        <h1 className="siska-akun-title">Manajemen Akun</h1>
        <p className="siska-akun-desc">Kelola akses pengguna yang dapat masuk ke SISKA.</p>
      </header>

      {/* ── Toolbar: Search & Action ── */}
      <div className="siska-akun-toolbar">
        <div className="siska-akun-search-box">
          <svg className="siska-akun-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="siska-akun-search-input"
            placeholder="Cari nama atau username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="siska-akun-search-shortcut">⌘ K</span>
        </div>

        <button type="button" className="siska-btn-tambah-user" onClick={handleOpenTambah}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* ── Card Table ── */}
      <div className="siska-akun-card">
        <div className="siska-akun-table-wrapper">
          <table className="siska-akun-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>NAMA LENGKAP</th>
                <th style={{ width: '25%' }}>USERNAME</th>
                <th style={{ width: '20%' }}>ROLE</th>
                <th style={{ width: '20%', textAlign: 'right', paddingRight: '28px' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="siska-akun-empty-row">
                    Tidak ada akun pengguna ditemukan
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuper = u.role === 'Super Admin';
                  const initials = getInitials(u.nama || u.nama_lengkap);

                  return (
                    <tr key={u.id}>
                      {/* Nama Lengkap + Avatar */}
                      <td className="siska-cell-user-info">
                        <div className="siska-user-row-avatar">
                          {initials}
                        </div>
                        <div className="siska-user-row-name">
                          <strong>{u.nama || u.nama_lengkap}</strong>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="siska-cell-username">
                        @{u.username}
                      </td>

                      {/* Role Badge */}
                      <td className="siska-cell-role">
                        <span className={`siska-role-badge ${isSuper ? 'badge-super' : 'badge-admin'}`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Aksi: Update & Hapus */}
                      <td className="siska-cell-actions">
                        <div className="siska-user-action-btns">
                          <button
                            type="button"
                            className="siska-action-btn btn-update"
                            onClick={() => handleOpenUpdate(u)}
                            title="Update akun"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            <span>Update</span>
                          </button>
                          <button
                            type="button"
                            className="siska-action-btn btn-hapus"
                            onClick={() => handleOpenDelete(u)}
                            title="Hapus akun"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer Card ── */}
        <div className="siska-akun-card-footer">
          <span className="siska-akun-footer-count">
            Menampilkan {filteredUsers.length} akun pengguna
          </span>
          <div className="siska-akun-footer-info">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Akses terbatas untuk Super Admin</span>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Update Akun */}
      <ModalUserForm
        isOpen={modalForm.isOpen}
        onClose={() => setModalForm({ isOpen: false, data: null })}
        onSave={handleSaveUser}
        initialData={modalForm.data}
      />

      {/* Modal Konfirmasi Hapus Akun */}
      <ModalKonfirmasiHapusUser
        isOpen={modalDelete.isOpen}
        onClose={() => setModalDelete({ isOpen: false, user: null })}
        onConfirm={handleConfirmDelete}
        user={modalDelete.user}
      />
    </div>
  );
};
export default AkunPage;

