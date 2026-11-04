// Data produk awal dari file Figma MPSI & SRS Toko ATK (Alya Fotocopy)
import { stockLogService } from './stockLogService';

export const initialProducts = [
  {
    id: 'prd_01',
    nama: 'Kertas HVS A4 80gsm',
    kategori: 'Kertas',
    hargaBeli: 200,
    harga: 300,
    stok: 5000,
    stok_minimal: 500,
    satuan: 'Lembar',
    kode: 'ATK-001',
    status_aktif: 1,
    satuan_opsi: [
      { tier: 1, nama: 'Lembar', namaSatuan: 'Lembar', pengali: 1, harga: 300, label: 'Ecer (1 Lembar)' },
      { tier: 2, nama: 'Rim', namaSatuan: 'Rim', pengali: 500, harga: 55000, label: 'Rim (isi 500 Lembar)' },
      { tier: 3, nama: 'Box', namaSatuan: 'Box', pengali: 2500, harga: 260000, label: 'Box (5 Rim / 2500 Lembar)' },
    ],
  },
  {
    id: 'prd_02',
    nama: 'Pena Standard AE7',
    kategori: 'Alat Tulis',
    hargaBeli: 1800,
    harga: 3000,
    stok: 144,
    stok_minimal: 24,
    satuan: 'Pcs',
    kode: 'ATK-002',
    status_aktif: 1,
    satuan_opsi: [
      { tier: 1, nama: 'Pcs', namaSatuan: 'Pcs', pengali: 1, harga: 3000, label: 'Ecer (1 Pcs)' },
      { tier: 2, nama: 'Pack', namaSatuan: 'Pack', pengali: 12, harga: 33000, label: 'Pack (isi 12 Pcs)' },
      { tier: 3, nama: 'Dus', namaSatuan: 'Dus', pengali: 144, harga: 380000, label: 'Dus (12 Pack / 144 Pcs)' },
    ],
  },
  {
    id: 'prd_03',
    nama: 'Buku Tulis 38 Lembar',
    kategori: 'Buku',
    hargaBeli: 3500,
    harga: 5000,
    stok: 100,
    stok_minimal: 20,
    satuan: 'Buku',
    kode: 'ATK-003',
    status_aktif: 1,
    satuan_opsi: [
      { tier: 1, nama: 'Buku', namaSatuan: 'Buku', pengali: 1, harga: 5000, label: 'Ecer (1 Buku)' },
      { tier: 2, nama: 'Pack', namaSatuan: 'Pack', pengali: 10, harga: 45000, label: 'Pack (isi 10 Buku)' },
      { tier: 3, nama: 'Karton', namaSatuan: 'Karton', pengali: 100, harga: 420000, label: 'Karton (10 Pack / 100 Buku)' },
    ],
  },
  {
    id: 'prd_04',
    nama: 'Penghapus Pensil 4B',
    kategori: 'Alat Tulis',
    hargaBeli: 2000,
    harga: 3500,
    stok: 40,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-004',
    status_aktif: 1,
    satuan_opsi: [
      { nama: 'Pcs', pengali: 1, harga: 3500, label: 'Ecer (1 Pcs)' },
      { nama: 'Kotak (20 Pcs)', pengali: 20, harga: 60000, label: 'Borongan (Kotak isi 20)' },
    ],
  },
  {
    id: 'prd_05',
    nama: 'Map Plastik Kancing',
    kategori: 'Arsip',
    hargaBeli: 2500,
    harga: 4000,
    stok: 15,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-005',
    status_aktif: 1,
    satuan_opsi: [
      { nama: 'Pcs', pengali: 1, harga: 4000, label: 'Ecer (1 Pcs)' },
      { nama: 'Lusin (12 Pcs)', pengali: 12, harga: 44000, label: 'Borongan (Lusin isi 12)' },
    ],
  },
  {
    id: 'prd_06',
    nama: 'Pensil 2B Faber-Castell',
    kategori: 'Alat Tulis',
    hargaBeli: 2500,
    harga: 4000,
    stok: 24,
    stok_minimal: 12,
    satuan: 'Pcs',
    kode: 'ATK-006',
    status_aktif: 1,
    satuan_opsi: [
      { nama: 'Pcs', pengali: 1, harga: 4000, label: 'Ecer (1 Pcs)' },
      { nama: 'Lusin (12 Pcs)', pengali: 12, harga: 44000, label: 'Borongan (Lusin isi 12)' },
    ],
  },
  {
    id: 'prd_07',
    nama: 'Spidol Permanen Hitam',
    kategori: 'Alat Tulis',
    hargaBeli: 6500,
    harga: 9000,
    stok: 20,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-007',
    status_aktif: 1,
    satuan_opsi: [
      { nama: 'Pcs', pengali: 1, harga: 9000, label: 'Ecer (1 Pcs)' },
      { nama: 'Lusin (12 Pcs)', pengali: 12, harga: 100000, label: 'Borongan (Lusin isi 12)' },
    ],
  },
  {
    id: 'prd_08',
    nama: 'Lem Kertas 35 gram',
    kategori: 'Perekat',
    hargaBeli: 5000,
    harga: 7500,
    stok: 18,
    stok_minimal: 8,
    satuan: 'Pcs',
    kode: 'ATK-008',
    status_aktif: 1,
    satuan_opsi: [
      { nama: 'Pcs', pengali: 1, harga: 7500, label: 'Ecer (1 Pcs)' },
      { nama: 'Pack (6 Pcs)', pengali: 6, harga: 40000, label: 'Borongan (Pack isi 6)' },
    ],
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
            
            // Hapus kategori Tinta Printer: jika ada data lama, otomatis pindahkan ke Lainnya/Alat Tulis
            let kategori = p.kategori || p.nama_kategori || 'Alat Tulis';
            if (kategori === 'Tinta Printer') {
              kategori = 'Alat Tulis';
            }

            // Opsi satuan jual (Eceran & Borongan / Grosir - Mendukung hingga 3 Tingkatan)
            const matchedInit = initialProducts.find((init) => init.id === id);
            const rawOpsi = p.satuan_opsi || matchedInit?.satuan_opsi || [
              { tier: 1, nama: satuan, namaSatuan: satuan, pengali: 1, harga: hargaJual, label: `Ecer (${satuan})` }
            ];
            const satuanOpsi = rawOpsi.map((opt, oIdx) => ({
              ...opt,
              tier: opt.tier || (oIdx + 1),
              namaSatuan: opt.namaSatuan || opt.nama?.split(' ')[0] || satuan,
            }));

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
              satuan_opsi: satuanOpsi,

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
  // Mendukung satuan ecer & borongan (pengali dihitung secara proporsional)
  kurangiStok: (cartItems, user = 'Petugas Toko') => {
    const current = productService.getProducts();
    const updated = current.map((p) => {
      // Hitung akumulasi stok dasar yang dibeli untuk produk p (quantity * pengali)
      const totalDibeli = cartItems
        .filter((c) => c.id === p.id)
        .reduce((sum, c) => sum + (c.quantity * (c.pengali || 1)), 0);

      if (totalDibeli > 0) {
        const stokBaru = Math.max(0, p.stok - totalDibeli);
        stockLogService.addLog({
          id_barang: p.id,
          nama_barang: p.nama,
          jenis: 'penjualan',
          jumlah: -totalDibeli,
          harga_beli: p.hargaBeli,
          catatan: `Penjualan kasir (${totalDibeli} ${p.satuan || 'unit'})`,
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
