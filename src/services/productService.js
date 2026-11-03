// Data produk awal dari file Figma MPSI (Frame 6:78 & Modul Stok)

export const initialProducts = [
  {
    id: 'prd_01',
    nama: 'Kertas HVS A4 80gsm',
    kategori: 'Kertas',
    harga: 55000,
    stok: 12,
    satuan: 'Rim',
    kode: 'KRT-001',
  },
  {
    id: 'prd_02',
    nama: 'Pena Standard AE7',
    kategori: 'Alat Tulis',
    harga: 3000,
    stok: 4,
    satuan: 'Pcs',
    kode: 'ATK-002',
  },
  {
    id: 'prd_03',
    nama: 'Buku Tulis 38 Lembar',
    kategori: 'Buku',
    harga: 5000,
    stok: 24,
    satuan: 'Buku',
    kode: 'BKU-003',
  },
  {
    id: 'prd_04',
    nama: 'Tinta Printer Hitam 100ml',
    kategori: 'Tinta Printer',
    harga: 35000,
    stok: 3,
    satuan: 'Botol',
    kode: 'TNT-004',
  },
  {
    id: 'prd_05',
    nama: 'Map Plastik Kancing',
    kategori: 'Arsip',
    harga: 4000,
    stok: 8,
    satuan: 'Pcs',
    kode: 'ARS-005',
  },
  {
    id: 'prd_06',
    nama: 'Pensil 2B Faber-Castell',
    kategori: 'Alat Tulis',
    harga: 4000,
    stok: 16,
    satuan: 'Pcs',
    kode: 'ATK-006',
  },
  {
    id: 'prd_07',
    nama: 'Spidol Permanen Hitam',
    kategori: 'Alat Tulis',
    harga: 9000,
    stok: 9,
    satuan: 'Pcs',
    kode: 'ATK-007',
  },
  {
    id: 'prd_08',
    nama: 'Lem Kertas 35 gram',
    kategori: 'Perekat',
    harga: 7500,
    stok: 14,
    satuan: 'Pcs',
    kode: 'PRK-008',
  },
];

export const productService = {
  getProducts: () => {
    const saved = localStorage.getItem('siska_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    localStorage.setItem('siska_products', JSON.stringify(initialProducts));
    return initialProducts;
  },

  saveProducts: (products) => {
    localStorage.setItem('siska_products', JSON.stringify(products));
  },
};

