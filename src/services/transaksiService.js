// Layanan penyimpanan riwayat transaksi di localStorage
// Digunakan oleh halaman Kasir (saat checkout) dan Laporan

const STORAGE_KEY = 'siska_transaksi';

export const transaksiService = {
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

  /** Tambah satu transaksi baru saat checkout kasir */
  tambah: (items, total, uangDiterima = total, kembalian = 0) => {
    const all = transaksiService.getAll();
    const padded = String(all.length + 1).padStart(3, '0');
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
    const noStruk = `TRX-${dateStr}-${padded}`;
    
    const newTx = {
      // Standar SRS (Tabel 6: transactions)
      id_transaksi: all.length + 1,
      no_struk: noStruk,
      id_user: 1,
      tanggal_transaksi: now.toISOString(),
      total_harga: total,
      uang_bayar: Number(uangDiterima) || total,
      kembalian: Number(kembalian) || 0,

      // Standar SRS (Tabel 7: transaction_details)
      transaction_details: items.map((i, idx) => ({
        id_detail: idx + 1,
        id_transaksi: all.length + 1,
        id_barang: i.isService ? null : i.id,
        id_layanan: i.isService ? i.id : null,
        qty: i.quantity || i.qty || 1,
        harga_satuan: i.harga,
        subtotal: i.harga * (i.quantity || i.qty || 1),
      })),

      // Alias untuk kompatibilitas frontend
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

  /** Seed data contoh agar laporan memiliki data awal yang representatif */
  seed: () => {
    const existing = transaksiService.getAll();
    if (existing.length > 0) return;

    const base = new Date();
    const sample = [
      { deltaDays: 0, deltaH: 2, id: 'TRX-240624-019', items: [{ nama: 'Kertas HVS A4 80gsm', qty: 2, harga: 55000 }, { nama: 'Pena Standard AE7', qty: 1, harga: 3000 }], total: 40000, jumlahBarang: 3 },
      { deltaDays: 0, deltaH: 3, id: 'TRX-240624-018', items: [{ nama: 'Buku Tulis 38 Lembar', qty: 5, harga: 5000 }], total: 78500, jumlahBarang: 5 },
      { deltaDays: 0, deltaH: 4, id: 'TRX-240624-017', items: [{ nama: 'Tinta Printer Hitam 100ml', qty: 2, harga: 35000 }], total: 26000, jumlahBarang: 2 },
      { deltaDays: 0, deltaH: 6, id: 'TRX-240624-016', items: [{ nama: 'Map Plastik Kancing', qty: 4, harga: 4000 }], total: 55000, jumlahBarang: 4 },
      { deltaDays: 1, deltaH: 2, id: 'TRX-240623-015', items: [{ nama: 'Pensil 2B Faber-Castell', qty: 3, harga: 4000 }], total: 37000, jumlahBarang: 3 },
      { deltaDays: 1, deltaH: 5, id: 'TRX-240623-014', items: [{ nama: 'Spidol Permanen Hitam', qty: 2, harga: 9000 }], total: 21000, jumlahBarang: 2 },
      { deltaDays: 2, deltaH: 1, id: 'TRX-240622-013', items: [{ nama: 'Lem Kertas 35 gram', qty: 5, harga: 7500 }], total: 52000, jumlahBarang: 5 },
      { deltaDays: 2, deltaH: 4, id: 'TRX-240622-012', items: [{ nama: 'Kertas HVS A4 80gsm', qty: 3, harga: 55000 }], total: 95000, jumlahBarang: 3 },
      { deltaDays: 3, deltaH: 3, id: 'TRX-240621-011', items: [{ nama: 'Buku Tulis 38 Lembar', qty: 4, harga: 5000 }], total: 43000, jumlahBarang: 4 },
      { deltaDays: 4, deltaH: 2, id: 'TRX-240620-010', items: [{ nama: 'Tinta Printer Hitam 100ml', qty: 1, harga: 35000 }], total: 35000, jumlahBarang: 1 },
      { deltaDays: 4, deltaH: 5, id: 'TRX-240620-009', items: [{ nama: 'Pena Standard AE7', qty: 6, harga: 3000 }], total: 62000, jumlahBarang: 6 },
      { deltaDays: 5, deltaH: 1, id: 'TRX-240619-008', items: [{ nama: 'Map Plastik Kancing', qty: 2, harga: 4000 }], total: 28000, jumlahBarang: 2 },
      { deltaDays: 5, deltaH: 4, id: 'TRX-240619-007', items: [{ nama: 'Spidol Permanen Hitam', qty: 3, harga: 9000 }], total: 55000, jumlahBarang: 3 },
      { deltaDays: 6, deltaH: 3, id: 'TRX-240618-006', items: [{ nama: 'Kertas HVS A4 80gsm', qty: 1, harga: 55000 }], total: 75000, jumlahBarang: 1 },
    ];

    const list = sample.map((s) => {
      const d = new Date(base);
      d.setDate(d.getDate() - s.deltaDays);
      d.setHours(d.getHours() - s.deltaH, 0, 0, 0);
      return {
        id: s.id,
        waktu: d.toISOString(),
        items: s.items.map((i) => ({ ...i, subtotal: i.qty * i.harga })),
        jumlahBarang: s.jumlahBarang,
        total: s.total,
        uangDiterima: s.total,
        kembalian: 0,
      };
    });

    transaksiService.save(list);
  },
};
