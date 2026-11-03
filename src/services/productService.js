// Data produk awal dari file Figma MPSI (Frame 6:78, Frame 6:4772 Modul Stok)

export const initialProducts = [
  {
    id: 'prd_01',
    nama: 'Kertas HVS A4 80gsm',
    kategori: 'Kertas',
    hargaBeli: 48000,
    harga: 55000,
    stok: 12,
    satuan: 'unit',
    kode: 'ATK-001',
  },
  {
    id: 'prd_02',
    nama: 'Pena Standard AE7',
    kategori: 'Alat Tulis',
    hargaBeli: 1800,
    harga: 3000,
    stok: 4,
    satuan: 'unit',
    kode: 'ATK-002',
  },
  {
    id: 'prd_03',
    nama: 'Buku Tulis 38 Lembar',
    kategori: 'Buku',
    hargaBeli: 3500,
    harga: 5000,
    stok: 24,
    satuan: 'unit',
    kode: 'ATK-003',
  },
  {
    id: 'prd_04',
    nama: 'Tinta Printer Hitam 100ml',
    kategori: 'Tinta Printer',
    hargaBeli: 28000,
    harga: 35000,
    stok: 3,
    satuan: 'unit',
    kode: 'ATK-004',
  },
  {
    id: 'prd_05',
    nama: 'Map Plastik Kancing',
    kategori: 'Arsip',
    hargaBeli: 2500,
    harga: 4000,
    stok: 8,
    satuan: 'unit',
    kode: 'ATK-005',
  },
  {
    id: 'prd_06',
    nama: 'Pensil 2B Faber-Castell',
    kategori: 'Alat Tulis',
    hargaBeli: 2500,
    harga: 4000,
    stok: 16,
    satuan: 'unit',
    kode: 'ATK-006',
  },
  {
    id: 'prd_07',
    nama: 'Spidol Permanen Hitam',
    kategori: 'Alat Tulis',
    hargaBeli: 6500,
    harga: 9000,
    stok: 9,
    satuan: 'unit',
    kode: 'ATK-007',
  },
  {
    id: 'prd_08',
    nama: 'Lem Kertas 35 gram',
    kategori: 'Perekat',
    hargaBeli: 5000,
    harga: 7500,
    stok: 14,
    satuan: 'unit',
    kode: 'ATK-008',
  },
];

export const productService = {
  getProducts: () => {
    const saved = localStorage.getItem('siska_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, idx) => ({
            ...p,
            hargaBeli: p.hargaBeli !== undefined ? p.hargaBeli : (initialProducts[idx]?.hargaBeli || Math.round(p.harga * 0.8)),
            satuan: p.satuan || 'unit',
          }));
        }
      } catch (e) {
        // fallback
      }
    }
    localStorage.setItem('siska_products', JSON.stringify(initialProducts));
    return initialProducts;
  },

  saveProducts: (products) => {
    localStorage.setItem('siska_products', JSON.stringify(products));
    window.dispatchEvent(new Event('siska_products_updated'));
  },

  // Kurangi stok saat checkout transaksi di Kasir
  kurangiStok: (cartItems) => {
    const current = productService.getProducts();
    const updated = current.map((p) => {
      const itemDibeli = cartItems.find((c) => c.id === p.id);
      if (itemDibeli) {
        return {
          ...p,
          stok: Math.max(0, p.stok - itemDibeli.quantity),
        };
      }
      return p;
    });
    productService.saveProducts(updated);
    return updated;
  },
};
