import { api } from './api';
import { productService } from './productService';

const STORAGE_KEY = 'siska_transaksi';

// Bersihkan data transaksi dummy lama dari fase mockup/development
const cleanLegacyTransaksi = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Hapus jika ada transaksi dengan kasir dummy atau id_user hardcode lama
      if (Array.isArray(parsed) && parsed.some((t) =>
        t.kasir === 'Demo Kasir' || t.kasir === 'Petugas Demo' || t.id === 'TRX-DEMO'
      )) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch {
    // abaikan
  }
};
cleanLegacyTransaksi();

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

export const normalizeTransactionItem = (t, idx = 0) => {
  if (!t) return t;
  const id = t.id || t.no_struk || (t.id_transaksi ? `TRX-${t.id_transaksi}` : `TRX-${idx + 1}`);
  const waktu = t.waktu || t.tanggal_transaksi || t.created_at || new Date().toISOString();
  const total = Number(t.total ?? t.total_harga ?? 0);
  const details = t.items || t.transaction_details || [];
  const jumlahBarang = Number(
    t.jumlahBarang ??
    t.jumlah_barang ??
    (Array.isArray(details) ? details.reduce((acc, it) => acc + Number(it.qty || it.quantity || 1), 0) : 0)
  );

  return {
    ...t,
    id,
    waktu,
    total,
    jumlahBarang,
    id_transaksi: t.id_transaksi || t.id,
    no_struk: t.no_struk || id,
    tanggal_transaksi: t.tanggal_transaksi || waktu,
    total_harga: t.total_harga ?? total,
    status: Boolean(t.status),
  };
};

export const transaksiService = {
  syncFromBackend: async () => {
    try {
      const res = await api.get('/transactions?limit=200');
      if (Array.isArray(res?.data)) {
        const normalized = res.data.map((t, idx) => normalizeTransactionItem(t, idx));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new Event('siska_transaksi_updated'));
        return normalized;
      }
    } catch {
      // Gunakan cache lokal jika server sedang offline
    }
    return transaksiService.getAll();
  },

  getAll: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((t, idx) => normalizeTransactionItem(t, idx)) : [];
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
  tambah: async (items, total, uangDiterima = 0, kembalian = 0) => {
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
          uang_bayar: Number(uangDiterima),
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
      uang_bayar: Number(uangDiterima) || 0,
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
      uangDiterima: Number(uangDiterima) || 0,
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

  /** Seed dinonaktifkan karena data transaksi dikelola langsung oleh BE-SISKA */
  seed: () => {},
};
