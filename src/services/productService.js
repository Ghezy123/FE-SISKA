import { api } from './api';
import { stockLogService } from './stockLogService';

// Data produk awal dikosongkan karena sudah terintegrasi dengan BE-SISKA
export const initialProducts = [];

// Pembersihan cache dummy lama dari fase mockup
const cleanLegacyMockData = () => {
  try {
    const raw = localStorage.getItem('siska_products');
    if (raw && (raw.includes('Kertas HVS A4 80gsm') || raw.includes('Pena Standard AE7') || raw.includes('ATK-001'))) {
      localStorage.removeItem('siska_products');
    }
  } catch {
    // Abaikan jika localStorage tidak dapat diakses
  }
};
cleanLegacyMockData();

const normalizeProductItem = (p, idx = 0) => {
  const id = p.id_barang ?? p.id ?? idx + 1;
  const nama = p.nama_barang || p.nama || '';
  const kode = p.kode_barang || p.kode || '';
  const hargaJual = Number(p.harga_jual ?? p.harga ?? 0);
  const hargaBeli = Number(p.harga_beli ?? p.hargaBeli ?? 0);
  const satuan = p.satuan || 'Pcs';
  const stok = Number(p.stok) || 0;
  const stokMin = p.stok_minimal !== undefined ? Number(p.stok_minimal) : 5;
  const statusAktif = p.status_aktif !== undefined ? Boolean(p.status_aktif) : true;

  let kategori = p.nama_kategori || p.kategori || 'Alat Tulis';
  if (kategori === 'Tinta Printer') {
    kategori = 'Alat Tulis';
  }

  const rawOpsi = p.satuan_opsi || [
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
    return [];
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
