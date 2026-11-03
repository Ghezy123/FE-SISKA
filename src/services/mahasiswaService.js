import { api } from './api';

export const mahasiswaService = {
  // Ambil semua mahasiswa
  async getAll() {
    // Bisa diganti: return api.get('/mahasiswa');
    // Data contoh untuk tampilan awal SISKA:
    return [
      { id: '1', nim: '230101001', nama: 'Ahmad Faiz', prodi: 'Sistem Informasi', angkatan: '2023', status: 'Aktif' },
      { id: '2', nim: '230101002', nama: 'Budi Santoso', prodi: 'Teknik Informatika', angkatan: '2023', status: 'Aktif' },
      { id: '3', nim: '230101003', nama: 'Citra Kirana', prodi: 'Sistem Informasi', angkatan: '2023', status: 'Cuti' },
      { id: '4', nim: '220101015', nama: 'Dinda Permata', prodi: 'Teknik Informatika', angkatan: '2022', status: 'Aktif' },
    ];
  },

  async getById(id) {
    return api.get(`/mahasiswa/${id}`);
  },

  async create(data) {
    return api.post('/mahasiswa', data);
  },

  async update(id, data) {
    return api.put(`/mahasiswa/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/mahasiswa/${id}`);
  },
};

