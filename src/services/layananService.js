// Layanan Cetak dan Jasa Fotokopi (Alya Fotocopy)
// 3 opsi utama: Print, Fotokopi, Laminating (Kasir langsung menginput nominal total transaksi)

const STORAGE_KEY = 'siska_services';

export const initialServices = [
  {
    id: 'srv_print',
    nama: 'Print',
    kategori: 'Jasa Cetak',
    deskripsi: 'Cetak dokumen tulisan, gambar, maupun warna',
  },
  {
    id: 'srv_fotokopi',
    nama: 'Fotokopi',
    kategori: 'Fotokopi',
    deskripsi: 'Penggandaan berkas & dokumen',
  },
  {
    id: 'srv_laminating',
    nama: 'Laminating',
    kategori: 'Laminasi',
    deskripsi: 'Laminasi pelindung dokumen & piagam',
  },
];

export const layananService = {
  getServices: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const isNewFormat =
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed.some((s) => s.id === 'srv_print');
        if (isNewFormat) return parsed;
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
