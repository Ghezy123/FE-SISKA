// Layanan pencatatan kartu riwayat perubahan stok (SRS Tabel 6: stock_logs)

const STORAGE_KEY = 'siska_stock_logs';

export const stockLogService = {
  getLogs: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addLog: ({ id_barang, nama_barang, jenis, jumlah, harga_beli = null, catatan = '', user = 'Petugas Toko' }) => {
    const logs = stockLogService.getLogs();
    const newLog = {
      id_log: `LOG-${Date.now()}`,
      id_barang,
      nama_barang,
      jenis, // 'stok_awal' | 'restok' | 'koreksi' | 'penjualan'
      jumlah, // bertanda positif (tambah) atau negatif (kurang)
      harga_beli,
      tanggal_log: new Date().toISOString(),
      catatan,
      user,
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  },
};

