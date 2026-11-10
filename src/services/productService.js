import { api } from './api';
import { stockLogService } from './stockLogService';

export const initialProducts = [
  {
    id: 1,
    id_barang: 1,
    nama: 'Kertas HVS A4 80gsm',
    nama_barang: 'Kertas HVS A4 80gsm',
    kategori: 'Kertas',
    nama_kategori: 'Kertas',
    id_kategori: 1,
    hargaBeli: 200,
    harga_beli: 200,
    harga: 300,
    harga_jual: 300,
    stok: 5000,
    stok_minimal: 500,
    satuan: 'Lembar',
    kode: 'ATK-001',
    kode_barang: 'ATK-001',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Lembar', namaSatuan: 'Lembar', pengali: 1, harga: 300, label: 'Ecer (1 Lembar)' },
      { tier: 2, nama: 'Rim', namaSatuan: 'Rim', pengali: 500, harga: 55000, label: 'Rim (isi 500 Lembar)' },
      { tier: 3, nama: 'Box', namaSatuan: 'Box', pengali: 2500, harga: 260000, label: 'Box (5 Rim / 2500 Lembar)' },
    ],
  },
  {
    id: 2,
    id_barang: 2,
    nama: 'Pena Standard AE7',
    nama_barang: 'Pena Standard AE7',
    kategori: 'Alat Tulis',
    nama_kategori: 'Alat Tulis',
    id_kategori: 2,
    hargaBeli: 1800,
    harga_beli: 1800,
    harga: 3000,
    harga_jual: 3000,
    stok: 144,
    stok_minimal: 24,
    satuan: 'Pcs',
    kode: 'ATK-002',
    kode_barang: 'ATK-002',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Pcs', namaSatuan: 'Pcs', pengali: 1, harga: 3000, label: 'Ecer (1 Pcs)' },
      { tier: 2, nama: 'Pack', namaSatuan: 'Pack', pengali: 12, harga: 33000, label: 'Pack (isi 12 Pcs)' },
      { tier: 3, nama: 'Dus', namaSatuan: 'Dus', pengali: 144, harga: 380000, label: 'Dus (12 Pack / 144 Pcs)' },
    ],
  },
  {
    id: 3,
    id_barang: 3,
    nama: 'Buku Tulis 38 Lembar',
    nama_barang: 'Buku Tulis 38 Lembar',
    kategori: 'Buku',
    nama_kategori: 'Buku',
    id_kategori: 3,
    hargaBeli: 3500,
    harga_beli: 3500,
    harga: 5000,
    harga_jual: 5000,
    stok: 100,
    stok_minimal: 20,
    satuan: 'Buku',
    kode: 'ATK-003',
    kode_barang: 'ATK-003',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Buku', namaSatuan: 'Buku', pengali: 1, harga: 5000, label: 'Ecer (1 Buku)' },
      { tier: 2, nama: 'Pack', namaSatuan: 'Pack', pengali: 10, harga: 45000, label: 'Pack (isi 10 Buku)' },
      { tier: 3, nama: 'Karton', namaSatuan: 'Karton', pengali: 100, harga: 420000, label: 'Karton (10 Pack / 100 Buku)' },
    ],
  },
  {
    id: 4,
    id_barang: 4,
    nama: 'Penghapus Pensil 4B',
    nama_barang: 'Penghapus Pensil 4B',
    kategori: 'Alat Tulis',
    nama_kategori: 'Alat Tulis',
    id_kategori: 2,
    hargaBeli: 2000,
    harga_beli: 2000,
    harga: 3500,
    harga_jual: 3500,
    stok: 40,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-004',
    kode_barang: 'ATK-004',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Pcs', namaSatuan: 'Pcs', pengali: 1, harga: 3500, label: 'Ecer (1 Pcs)' },
      { tier: 2, nama: 'Kotak (20 Pcs)', namaSatuan: 'Kotak', pengali: 20, harga: 60000, label: 'Borongan (Kotak isi 20)' },
    ],
  },
  {
    id: 5,
    id_barang: 5,
    nama: 'Map Plastik Kancing',
    nama_barang: 'Map Plastik Kancing',
    kategori: 'Arsip',
    nama_kategori: 'Arsip',
    id_kategori: 4,
    hargaBeli: 2500,
    harga_beli: 2500,
    harga: 4000,
    harga_jual: 4000,
    stok: 15,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-005',
    kode_barang: 'ATK-005',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Pcs', namaSatuan: 'Pcs', pengali: 1, harga: 4000, label: 'Ecer (1 Pcs)' },
      { tier: 2, nama: 'Lusin (12 Pcs)', namaSatuan: 'Lusin', pengali: 12, harga: 44000, label: 'Borongan (Lusin isi 12)' },
    ],
  },
  {
    id: 6,
    id_barang: 6,
    nama: 'Pensil 2B Faber-Castell',
    nama_barang: 'Pensil 2B Faber-Castell',
    kategori: 'Alat Tulis',
    nama_kategori: 'Alat Tulis',
    id_kategori: 2,
    hargaBeli: 2500,
    harga_beli: 2500,
    harga: 4000,
    harga_jual: 4000,
    stok: 24,
    stok_minimal: 12,
    satuan: 'Pcs',
    kode: 'ATK-006',
    kode_barang: 'ATK-006',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Pcs', namaSatuan: 'Pcs', pengali: 1, harga: 4000, label: 'Ecer (1 Pcs)' },
      { tier: 2, nama: 'Lusin (12 Pcs)', namaSatuan: 'Lusin', pengali: 12, harga: 44000, label: 'Borongan (Lusin isi 12)' },
    ],
  },
  {
    id: 7,
    id_barang: 7,
    nama: 'Spidol Permanen Hitam',
    nama_barang: 'Spidol Permanen Hitam',
    kategori: 'Alat Tulis',
    nama_kategori: 'Alat Tulis',
    id_kategori: 2,
    hargaBeli: 6500,
    harga_beli: 6500,
    harga: 9000,
    harga_jual: 9000,
    stok: 20,
    stok_minimal: 10,
    satuan: 'Pcs',
    kode: 'ATK-007',
    kode_barang: 'ATK-007',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Pcs', namaSatuan: 'Pcs', pengali: 1, harga: 9000, label: 'Ecer (1 Pcs)' },
      { tier: 2, nama: 'Lusin (12 Pcs)', namaSatuan: 'Lusin', pengali: 12, harga: 100000, label: 'Borongan (Lusin isi 12)' },
    ],
  },
  {
    id: 8,
    id_barang: 8,
    nama: 'Lem Kertas 35 gram',
    nama_barang: 'Lem Kertas 35 gram',
    kategori: 'Perekat',
    nama_kategori: 'Perekat',
    id_kategori: 5,
    hargaBeli: 5000,
    harga_beli: 5000,
    harga: 7500,
    harga_jual: 7500,
    stok: 18,
    stok_minimal: 8,
    satuan: 'Pcs',
    kode: 'ATK-008',
    kode_barang: 'ATK-008',
    status_aktif: true,
    satuan_opsi: [
      { tier: 1, nama: 'Pcs', namaSatuan: 'Pcs', pengali: 1, harga: 7500, label: 'Ecer (1 Pcs)' },
      { tier: 2, nama: 'Pack (6 Pcs)', namaSatuan: 'Pack', pengali: 6, harga: 40000, label: 'Borongan (Pack isi 6)' },
    ],
  },
];

const normalizeProductItem = (p, idx = 0) => {
  const id = p.id_barang ?? p.id ?? idx + 1;
  const nama = p.nama_barang || p.nama || '';
  const kode = p.kode_barang || p.kode || `ATK-${String(idx + 1).padStart(3, '0')}`;
  const hargaJual = Number(p.harga_jual ?? p.harga ?? 0);
  const hargaBeli = Number(
    p.harga_beli ?? p.hargaBeli ?? initialProducts[idx]?.hargaBeli ?? Math.round(hargaJual * 0.8)
  );
  const satuan = p.satuan || 'Pcs';
  const stok = Number(p.stok) || 0;
  const stokMin = p.stok_minimal !== undefined ? Number(p.stok_minimal) : 5;
  const statusAktif = p.status_aktif !== undefined ? Boolean(p.status_aktif) : true;

  let kategori = p.nama_kategori || p.kategori || 'Alat Tulis';
  if (kategori === 'Tinta Printer') {
    kategori = 'Alat Tulis';
  }

  const matchedInit = initialProducts.find(
    (init) => init.kode === kode || String(init.id) === String(id)
  );
  const rawOpsi = p.satuan_opsi || matchedInit?.satuan_opsi || [
    {
      tier: 1,
      nama: satuan,
      namaSatuan: satuan,
      pengali: 1,
      harga: hargaJual,
      label: `Ecer (${satuan})`,
    },
  ];
  const satuanOpsi = rawOpsi.map((opt, oIdx) => ({
    ...opt,
    tier: opt.tier || oIdx + 1,
    namaSatuan: opt.namaSatuan || opt.nama?.split(' ')[0] || satuan,
  }));

  return {
    id_barang: id,
    kode_barang: kode,
    nama_barang: nama,
    id_kategori: p.id_kategori,
    nama_kategori: kategori,
    harga_beli: hargaBeli,
    harga_jual: hargaJual,
    stok,
    stok_minimal: stokMin,
    satuan,
    status_aktif: statusAktif,
    satuan_opsi: satuanOpsi,
    id,
    nama,
    kode,
    hargaBeli,
    harga: hargaJual,
    kategori,
  };
};

export const productService = {
  /**
   * Sinkronisasi daftar barang aktif dari REST API BE-SISKA (GET /api/products)
   */
  syncFromBackend: async () => {
    try {
      const res = await api.get('/products');
      if (Array.isArray(res?.data)) {
        const normalized = res.data.map((p, idx) => normalizeProductItem(p, idx));
        localStorage.setItem('siska_products', JSON.stringify(normalized));
        window.dispatchEvent(new Event('siska_products_updated'));
        return normalized;
      }
    } catch {
      // Gunakan cache lokal jika server sedang tidak aktif
    }
    return productService.getProducts();
  },

  getProducts: () => {
    const saved = localStorage.getItem('siska_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .map((p, idx) => normalizeProductItem(p, idx))
            .filter((p) => p.status_aktif !== false && p.status_aktif !== 0);
        }
      } catch {
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

  // Soft delete barang (DELETE /api/products/:id)
  hapusBarang: async (id) => {
    try {
      if (!Number.isNaN(Number(id))) {
        await api.delete(`/products/${Number(id)}`);
        return await productService.syncFromBackend();
      }
    } catch {
      // Fallback ke penyimpanan lokal bila offline
    }
    const current = productService.getProducts();
    const updated = current.filter((p) => String(p.id) !== String(id));
    productService.saveProducts(updated);
    return updated;
  },

  // Kurangi stok lokal saat checkout (jika backend aktif, pengurangan stok dilakukan atomik oleh POST /api/transactions)
  kurangiStok: (cartItems, user = 'Petugas Toko') => {
    const current = productService.getProducts();
    const updated = current.map((p) => {
      const totalDibeli = cartItems
        .filter((c) => !c.isService && String(c.id) === String(p.id))
        .reduce((sum, c) => sum + c.quantity * (c.pengali || 1), 0);

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

  // Tambah barang baru beserta log stok awal (POST /api/products)
  tambahBarang: async (barang, user = 'Petugas Toko') => {
    try {
      const res = await api.post('/products', {
        kode_barang: barang.kode || barang.kode_barang || undefined,
        nama_barang: barang.nama || barang.nama_barang,
        kategori: barang.kategori || barang.nama_kategori,
        satuan: barang.satuan || 'Pcs',
        harga_beli: Number(barang.hargaBeli ?? barang.harga_beli ?? 0),
        harga_jual: Number(barang.harga ?? barang.harga_jual ?? 0),
        stok: Number(barang.stok ?? 0),
        stok_minimal: Number(barang.stok_minimal ?? 5),
        satuan_opsi: barang.satuan_opsi,
      });
      await productService.syncFromBackend();
      return normalizeProductItem(res.data);
    } catch (err) {
      if (err.status) throw err;
    }

    const current = productService.getProducts();
    const newProduct = normalizeProductItem(
      {
        ...barang,
        id: barang.id || current.length + 1,
        stok_minimal: Number(barang.stok_minimal) || 5,
        satuan: barang.satuan || 'Pcs',
        status_aktif: true,
      },
      current.length
    );
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

  // Update harga & satuan opsi barang (PUT /api/products/:id)
  updateBarang: async (updatedProduct) => {
    const id = updatedProduct.id_barang ?? updatedProduct.id;
    try {
      if (!Number.isNaN(Number(id))) {
        await api.put(`/products/${Number(id)}`, {
          nama_barang: updatedProduct.nama_barang || updatedProduct.nama,
          kategori: updatedProduct.kategori || updatedProduct.nama_kategori,
          satuan: updatedProduct.satuan,
          harga_beli: Number(updatedProduct.hargaBeli ?? updatedProduct.harga_beli ?? 0),
          harga_jual: Number(updatedProduct.harga ?? updatedProduct.harga_jual ?? 0),
          stok_minimal: Number(updatedProduct.stok_minimal ?? 5),
          satuan_opsi: updatedProduct.satuan_opsi,
        });
        return await productService.syncFromBackend();
      }
    } catch (err) {
      if (err.status) throw err;
    }

    const current = productService.getProducts();
    const updated = current.map((p) =>
      String(p.id) === String(id) ? normalizeProductItem(updatedProduct) : p
    );
    productService.saveProducts(updated);
    return updated;
  },

  // Update stok / Restok (POST /api/products/:id/restock)
  restokBarang: async (id, tambahStok, user = 'Petugas Toko', catatan = 'Restok barang masuk') => {
    try {
      if (!Number.isNaN(Number(id))) {
        await api.post(`/products/${Number(id)}/restock`, {
          jumlah: Number(tambahStok),
          catatan: catatan || 'Restok barang masuk',
        });
        return await productService.syncFromBackend();
      }
    } catch (err) {
      if (err.status) throw err;
    }

    const current = productService.getProducts();
    let target = null;
    const updated = current.map((p) => {
      if (String(p.id) === String(id)) {
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

  // Koreksi stok fisik / stock opname (POST /api/products/:id/adjust-stock)
  koreksiStokBarang: async (id, jumlahKoreksi, catatan) => {
    const res = await api.post(`/products/${Number(id)}/adjust-stock`, {
      jumlah_koreksi: Number(jumlahKoreksi),
      catatan,
    });
    await productService.syncFromBackend();
    return res.data;
  },
};
