// Layanan Cetak dan Jasa Fotokopi (SRS Tabel 4: services)

const STORAGE_KEY = 'siska_services';

export const initialServices = [
  {
    id: 'srv_01',
    nama: 'Print Hitam Putih (A4)',
    kategori: 'Jasa Cetak',
    satuan: 'lembar',
    harga: 500,
    status_aktif: 1,
  },
  {
    id: 'srv_02',
    nama: 'Print Full Warna (A4)',
    kategori: 'Jasa Cetak',
    satuan: 'lembar',
    harga: 1500,
    status_aktif: 1,
  },
  {
    id: 'srv_03',
    nama: 'Fotokopi Kertas A4/F4',
    kategori: 'Fotokopi',
    satuan: 'lembar',
    harga: 300,
    status_aktif: 1,
  },
  {
    id: 'srv_04',
    nama: 'Jilid Spiral Plastik + Cover',
    kategori: 'Jilid & Finishing',
    satuan: 'buku',
    harga: 7000,
    status_aktif: 1,
  },
  {
    id: 'srv_05',
    nama: 'Laminating Dokumen A4',
    kategori: 'Jilid & Finishing',
    satuan: 'lembar',
    harga: 4000,
    status_aktif: 1,
  },
];

export const layananService = {
  getServices: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

