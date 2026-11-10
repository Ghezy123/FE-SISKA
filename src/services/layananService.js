import { api } from './api';

const STORAGE_KEY = 'siska_services';

export const initialServices = [
  {
    id: 'srv_print',
    id_layanan: 1,
    nama: 'Print',
    nama_layanan: 'Print',
    satuan: 'lembar',
    harga_default: 1000,
    kategori: 'Jasa Cetak',
    deskripsi: 'Cetak dokumen tulisan, gambar, maupun warna',
  },
  {
    id: 'srv_fotokopi',
    id_layanan: 2,
    nama: 'Fotokopi',
    nama_layanan: 'Fotokopi',
    satuan: 'lembar',
    harga_default: 500,
    kategori: 'Fotokopi',
    deskripsi: 'Penggandaan berkas & dokumen',
  },
  {
    id: 'srv_laminating',
    id_layanan: 3,
    nama: 'Laminating',
    nama_layanan: 'Laminating',
    satuan: 'lembar',
    harga_default: 3000,
    kategori: 'Laminasi',
    deskripsi: 'Laminasi pelindung dokumen & piagam',
  },
];

const normalizeService = (s, idx = 0) => {
  const nama = s.nama_layanan || s.nama || 'Layanan';
  const lower = nama.toLowerCase();
  const uiId = lower.includes('print')
    ? 'srv_print'
    : lower.includes('fotokopi')
    ? 'srv_fotokopi'
    : lower.includes('laminat')
    ? 'srv_laminating'
    : s.id || `srv_${s.id_layanan || idx + 1}`;

  const matchedInit = initialServices.find((init) => init.id === uiId);

  return {
    id: uiId,
    id_layanan: Number(s.id_layanan) || matchedInit?.id_layanan || idx + 1,
    nama,
    nama_layanan: nama,
    satuan: s.satuan || matchedInit?.satuan || 'lembar',
    harga_default: Number(s.harga_default ?? matchedInit?.harga_default ?? 1000),
    kategori: s.kategori || matchedInit?.kategori || 'Jasa Cetak',
    deskripsi: s.deskripsi || matchedInit?.deskripsi || 'Layanan cetak & jasa Alya Fotocopy',
  };
};

export const layananService = {
  syncFromBackend: async () => {
    try {
      const res = await api.get('/services');
      if (Array.isArray(res?.data) && res.data.length > 0) {
        const normalized = res.data.map((s, idx) => normalizeService(s, idx));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new Event('siska_services_updated'));
        return normalized;
      }
    } catch {
      // Gunakan cache lokal jika server sedang offline
    }
    return layananService.getServices();
  },

  getServices: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => normalizeService(s, idx));
        }
      }
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialServices));
    return initialServices;
  },

  saveServices: (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('siska_services_updated'));
  },
};
