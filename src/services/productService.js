// Data produk awal dari file Figma MPSI & SRS Toko ATK (Alya Fotocopy)
import { stockLogService } from './stockLogService';

export const initialProducts = [
  {
    id: 'prd_01',
    nama: 'Kertas HVS A4 80gsm',
    kategori: 'Kertas',
    hargaBeli: 48000,
    harga: 55000,
    stok: 12,
    stok_minimal: 5,
    satuan: 'Rim',
    kode: 'ATK-001',
    status_aktif: 1,
  },
  {
    id: 'prd_02',
    nama: 'Pena Standard AE7',
    kategori: 'Alat Tulis',
    hargaBeli: 1800,
    harga: 3000,
    stok: 4,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-002',
    status_aktif: 1,
  },
  {
    id: 'prd_03',
    nama: 'Buku Tulis 38 Lembar',
    kategori: 'Buku',
    hargaBeli: 3500,
    harga: 5000,
    stok: 24,
    stok_minimal: 10,
    satuan: 'Buku',
    kode: 'ATK-003',
    status_aktif: 1,
  },
  {
    id: 'prd_04',
    nama: 'Tinta Printer Hitam 100ml',
    kategori: 'Tinta Printer',
    hargaBeli: 28000,
    harga: 35000,
    stok: 3,
    stok_minimal: 5,
    satuan: 'Botol',
    kode: 'ATK-004',
    status_aktif: 1,
  },
  {
    id: 'prd_05',
    nama: 'Map Plastik Kancing',
    kategori: 'Arsip',
    hargaBeli: 2500,
    harga: 4000,
    stok: 8,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-005',
    status_aktif: 1,
  },
  {
    id: 'prd_06',
    nama: 'Pensil 2B Faber-Castell',
    kategori: 'Alat Tulis',
    hargaBeli: 2500,
    harga: 4000,
    stok: 16,
    stok_minimal: 12,
    satuan: 'Pcs',
    kode: 'ATK-006',
    status_aktif: 1,
  },
  {
    id: 'prd_07',
    nama: 'Spidol Permanen Hitam',
    kategori: 'Alat Tulis',
    hargaBeli: 6500,
    harga: 9000,
    stok: 9,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-007',
    status_aktif: 1,
  },
  {
    id: 'prd_08',
    nama: 'Lem Kertas 35 gram',
    kategori: 'Perekat',
    hargaBeli: 5000,
    harga: 7500,
    stok: 14,
    stok_minimal: 8,
    satuan: 'Pcs',
    kode: 'ATK-008',
    status_aktif: 1,
  },
];

export const productService = {
  getProducts: () => {
    const saved = localStorage.getItem('siska_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, idx) => {
            const id = p.id || p.id_barang || `prd_${idx + 1}`;
            const nama = p.nama || p.nama_barang;
            const kode = p.kode || p.kode_barang || `ATK-${String(idx + 1).padStart(3, '0')}`;
            const hargaJual = p.harga ?? p.harga_jual ?? 0;
            const hargaBeli = p.hargaBeli ?? p.harga_beli ?? (initialProducts[idx]?.hargaBeli || Math.round(hargaJual * 0.8));
            const satuan = p.satuan || 'Pcs';
            const stok = Number(p.stok) || 0;
            const stokMin = p.stok_minimal !== undefined ? Number(p.stok_minimal) : 5;
            const statusAktif = p.status_aktif !== undefined ? p.status_aktif : 1;
            const kategori = p.kategori || p.nama_kategori || 'Alat Tulis';

            return {
              // Standar SRS (Tabel products)
              id_barang: id,
              kode_barang: kode,
              nama_barang: nama,
              harga_beli: hargaBeli,
              harga_jual: hargaJual,
              stok,
              stok_minimal: stokMin,
              satuan,
              status_aktif: statusAktif,
              nama_kategori: kategori,

              // Alias kompatibilitas frontend
              id,
              nama,
              kode,
              hargaBeli,
              harga: hargaJual,
              kategori,
            };
          }).filter(p => p.status_aktif !== 0);
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

  // Soft delete barang (SRS Tabel Products: status_aktif)
  hapusBarang: (id) => {
    const current = productService.getProducts();
    const updated = current.filter(p => p.id !== id);
    productService.saveProducts(updated);
    return updated;
  },

  // Kurangi stok saat checkout transaksi kasir & catat log penjualan
  kurangiStok: (cartItems, user = 'Petugas Toko') => {
    const current = productService.getProducts();
    const updated = current.map((p) => {
      const itemDibeli = cartItems.find((c) => c.id === p.id);
      if (itemDibeli) {
        const stokBaru = Math.max(0, p.stok - itemDibeli.quantity);
        stockLogService.addLog({
          id_barang: p.id,
          nama_barang: p.nama,
          jenis: 'penjualan',
          jumlah: -itemDibeli.quantity,
          harga_beli: p.hargaBeli,
          catatan: `Penjualan kasir (${itemDibeli.quantity} ${p.satuan || 'unit'})`,
          user,
        });
        return {
          ...p,
          stok: stokBaru,
        };
      }
      return p;
    });
    productService.saveProducts(updated);
    return updated;
  },

  // Tambah barang baru beserta log stok awal
  tambahBarang: (barang, user = 'Petugas Toko') => {
    const current = productService.getProducts();
    const newProduct = {
      ...barang,
      id: barang.id || `prd_${Date.now()}`,
      stok_minimal: Number(barang.stok_minimal) || 5,
      satuan: barang.satuan || 'Pcs',
      status_aktif: 1,
    };
    const updated = [...current, newProduct];
    productService.saveProducts(updated);

    if (newProduct.stok > 0) {
      stockLogService.addLog({
        id_barang: newProduct.id,
        nama_barang: newProduct.nama,
        jenis: 'stok_awal',
        jumlah: newProduct.stok,
        harga_beli: newProduct.hargaBeli,
        catatan: 'Input stok barang awal',
        user,
      });
    }

    return newProduct;
  },

  // Update stok (Restok)
  restokBarang: (id, tambahStok, user = 'Petugas Toko', catatan = 'Restok barang masuk') => {
    const current = productService.getProducts();
    let target = null;
    const updated = current.map((p) => {
      if (p.id === id) {
        target = p;
        return { ...p, stok: p.stok + Number(tambahStok) };
      }
      return p;
    });
    productService.saveProducts(updated);

    if (target) {
      stockLogService.addLog({
        id_barang: target.id,
        nama_barang: target.nama,
        jenis: 'restok',
        jumlah: Number(tambahStok),
        harga_beli: target.hargaBeli,
        catatan,
        user,
      });
    }

    return updated;
  },
};
