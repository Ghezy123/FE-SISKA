import { api } from './api';
import { isSuperAdminRole } from '../utils/constants';

const STORAGE_KEY = 'siska_users';

// Bersihkan data user dummy lama dari fase mockup/development
const cleanLegacyUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Hapus jika isinya adalah dummy users hardcode lama
      if (Array.isArray(parsed) && parsed.some((u) =>
        u.username === 'budi.admin' || u.username === 'siti.kasir' || u.username === 'ahmad.stok'
      )) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch {
    // abaikan
  }
};
cleanLegacyUsers();

const normalizeUserItem = (u, idx = 0) => {
  const id = u.id_user ?? u.id ?? idx + 1;
  const nama = u.nama_lengkap || u.nama || 'Pengguna';
  const username = (u.username || '').replace(/^@/, '');
  const roleRaw = u.role || (u.id_role === 1 ? 'Owner' : 'Employee');
  const role = isSuperAdminRole(roleRaw) ? 'Super Admin' : 'Admin';
  const statusAktif = u.status_aktif !== undefined ? Boolean(u.status_aktif) : true;

  return {
    id,
    id_user: id,
    nama,
    nama_lengkap: nama,
    username,
    role,
    status_aktif: statusAktif,
  };
};

export const userService = {
  syncFromBackend: async () => {
    try {
      const res = await api.get('/users');
      if (Array.isArray(res?.data) && res.data.length > 0) {
        const normalized = res.data.map((u, idx) => normalizeUserItem(u, idx));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new Event('siska_users_updated'));
        return normalized;
      }
    } catch {
      // Gunakan data lokal jika server offline
    }
    return userService.getUsers();
  },

  getUsers: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u, idx) => normalizeUserItem(u, idx));
        }
      }
    } catch {
      // fallback
    }
    // Kembalikan array kosong — data harus dari BE
    return [];
  },

  saveUsers: (users) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('siska_users_updated'));
  },

  createUser: async ({ nama, username, password, role }) => {
    const cleanUsername = (username || '').trim().replace(/^@/, '');
    const cleanNama = (nama || '').trim();
    const cleanRole = role === 'Super Admin' ? 'Super Admin' : 'Admin';

    const res = await api.post('/users', {
      nama_lengkap: cleanNama,
      username: cleanUsername,
      password,
      role: cleanRole === 'Super Admin' ? 'Owner' : 'Employee',
    });
    await userService.syncFromBackend();
    return normalizeUserItem(res.data);
  },

  updateUser: async (id, { nama, username, password, role }) => {
    const cleanUsername = (username || '').trim().replace(/^@/, '');
    const cleanNama = (nama || '').trim();
    const cleanRole = role === 'Super Admin' ? 'Super Admin' : 'Admin';

    // Update nama/username/role melalui endpoint backend
    await api.patch(`/users/${Number(id)}`, {
      nama_lengkap: cleanNama,
      username: cleanUsername,
      role: cleanRole === 'Super Admin' ? 'Owner' : 'Employee',
    });

    // Jika ada password baru, reset password melalui endpoint backend
    if (password && password.trim()) {
      await api.post(`/users/${Number(id)}/reset-password`, {
        new_password: password.trim(),
      });
    }

    await userService.syncFromBackend();
    return userService.getUsers().find((u) => String(u.id) === String(id));
  },

  deleteUser: async (id) => {
    await api.patch(`/users/${Number(id)}/status`, {
      status_aktif: false,
    });
    await userService.syncFromBackend();
    return true;
  },
};

