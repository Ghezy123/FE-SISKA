import { api } from './api';
import { productService } from './productService';

const STORAGE_KEY = 'siska_transaksi';

const resolveServiceId = (item) => {
  if (item.id_layanan && !Number.isNaN(Number(item.id_layanan))) {
    return Number(item.id_layanan);
  }
  const raw = String(item.id || '').toLowerCase();
  if (raw.includes('print')) return 1;
  if (raw.includes('fotokopi')) return 2;
  if (raw.includes('laminat')) return 3;
  const parsed = Number(item.id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

const resolveProductId = (item) => {
  if (item.id_barang && !Number.isNaN(Number(item.id_barang))) {
    return Number(item.id_barang);
  }
  const raw = String(item.id || '');
  if (raw.startsWith('prd_')) {
    return Number.parseInt(raw.replace('prd_', ''), 10) || 1;
  }
  return Number(item.id) || 1;
};

export const transaksiService = {
  syncFromBackend: async () => {
    try {
      const res = await api.get('/transactions?limit=200');
      if (Array.isArray(res?.data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        window.dispatchEvent(new Event('siska_transaksi_updated'));
        return res.data;
      }
    } catch {
      // Gunakan cache lokal jika server sedang offline
    }
    return transaksiService.getAll();
  },

  getAll: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save: (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('siska_transaksi_updated'));
  },

  /**
   * Tambah satu transaksi baru saat checkout kasir.
   * Terhubung ke POST /api/transactions di BE-SISKA (dengan fallback lokal bila server offline).
   */
  tambah: async (items, total, uangDiterima = total, kembalian = 0) => {
    const idempotencyKey = `trx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      const payloadItems = items.map((i) => {
        const qty = Number(i.quantity || i.qty || 1);
        if (i.isService) {
          return {
            id_layanan: resolveServiceId(i),
            qty,
            harga_satuan: Number(i.harga),
          };
        }
        return {
          id_barang: resolveProductId(i),
          qty,
          satuan: i.satuan || undefined,
        };
      });

      const res = await api.post(
        '/transactions',
        {
          uang_bayar: Number(uangDiterima) || Number(total),
          idempotency_key: idempotencyKey,
          items: payloadItems,
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        }
      );

      const createdTx = res.data;
      await productService.syncFromBackend();
      await transaksiService.syncFromBackend();
      return createdTx;
    } catch (err) {
      if (err.status) {
        throw err;
      }
    }

    // Fallback lokal apabila server BE-SISKA sedang tidak menyala
    productService.kurangiStok(items);
    const all = transaksiService.getAll();
    const padded = String(all.length + 1).padStart(4, '0');
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const noStruk = `TRX-${dateStr}-${padded}`;

    const newTx = {
      id_transaksi: all.length + 1,
      no_struk: noStruk,
      id_user: 1,
      kasir: 'Petugas Toko',
      tanggal_transaksi: now.toISOString(),
      total_harga: total,
      uang_bayar: Number(uangDiterima) || total,
      kembalian: Number(kembalian) || 0,
      status: false,
      status_label: 'AKTIF',
      void_reason: null,
      transaction_details: items.map((i, idx) => ({
        id_detail: idx + 1,
        id_transaksi: all.length + 1,
        id_barang: i.isService ? null : resolveProductId(i),
        id_layanan: i.isService ? resolveServiceId(i) : null,
        qty: i.quantity || i.qty || 1,
        harga_satuan: i.harga,
        subtotal: i.harga * (i.quantity || i.qty || 1),
      })),
      id: noStruk,
      waktu: now.toISOString(),
      items: items.map((i) => ({
        id: i.id,
        nama: i.nama,
        qty: i.quantity || i.qty || 1,
        harga: i.harga,
        subtotal: i.harga * (i.quantity || i.qty || 1),
      })),
      jumlahBarang: items.reduce((s, i) => s + (i.quantity || i.qty || 1), 0),
      total,
      uangDiterima: Number(uangDiterima) || total,
    };

    const updated = [newTx, ...all];
    transaksiService.save(updated);
    return newTx;
  },

  /**
   * Membatalkan transaksi (VOID) dan mengembalikan stok barang secara otomatis (POST /api/transactions/:id/void)
   */
  voidTransaksi: async (tx, voidReason) => {
    if (!voidReason || voidReason.trim().length < 3) {
      throw new Error('Alasan pembatalan (void) wajib diisi minimal 3 karakter');
    }

    const idTransaksi = tx.id_transaksi || tx.id;
    try {
      if (!Number.isNaN(Number(idTransaksi))) {
        const res = await api.post(`/transactions/${Number(idTransaksi)}/void`, {
          void_reason: voidReason.trim(),
        });
        await productService.syncFromBackend();
        await transaksiService.syncFromBackend();
        return res.data;
      }
    } catch (err) {
      if (err.status) {
        throw err;
      }
    }

    // Fallback lokal bila server sedang offline
    const all = transaksiService.getAll();
    const updated = all.map((item) => {
      if (item.id === tx.id || item.id_transaksi === tx.id_transaksi) {
        return {
          ...item,
          status: true,
          status_label: 'VOID',
          void_reason: voidReason.trim(),
          alasanVoid: voidReason.trim(),
          voided_at: new Date().toISOString(),
        };
      }
      return item;
    });
    transaksiService.save(updated);
    return updated.find((item) => item.id === tx.id || item.id_transaksi === tx.id_transaksi);
  },

  /** Seed data contoh apabila mode offline belum memiliki transaksi */
  seed: () => {
    const existing = transaksiService.getAll();
    if (existing.length > 0) return;

    const base = new Date();
    const sample = [
      {
        deltaDays: 0,
        deltaH: 2,
        id_transaksi: 1,
        id: 'TRX-20261110-0001',
        items: [
          { nama: 'Kertas HVS A4 80gsm', qty: 1, harga: 55000 },
          { nama: 'Pena Standard AE7', qty: 2, harga: 3000 },
        ],
        total: 61000,
        jumlahBarang: 3,
      },
      {
        deltaDays: 1,
        deltaH: 3,
        id_transaksi: 2,
        id: 'TRX-20261109-0001',
        items: [{ nama: 'Buku Tulis 38 Lembar', qty: 5, harga: 5000 }],
        total: 25000,
        jumlahBarang: 5,
      },
    ];

    const list = sample.map((s) => {
      const d = new Date(base);
      d.setDate(d.getDate() - s.deltaDays);
      d.setHours(d.getHours() - s.deltaH, 0, 0, 0);
      return {
        id_transaksi: s.id_transaksi,
        no_struk: s.id,
        id: s.id,
        waktu: d.toISOString(),
        tanggal_transaksi: d.toISOString(),
        status: false,
        status_label: 'AKTIF',
        items: s.items.map((i) => ({ ...i, subtotal: i.qty * i.harga })),
        jumlahBarang: s.jumlahBarang,
        total: s.total,
        total_harga: s.total,
        uangDiterima: s.total,
        uang_bayar: s.total,
        kembalian: 0,
      };
    });

    transaksiService.save(list);
  },
};
