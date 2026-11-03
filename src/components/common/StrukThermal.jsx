import React from 'react';
import { formatRupiah } from '../../utils/helpers';
import './StrukThermal.css';

/**
 * Komponen Struk Thermal (58mm / 80mm POS Printer)
 * Sesuai SRS & BRD: Toko "Alya Fotocopy"
 * Menampilkan rincian transaksi, kasir, total, uang diterima, dan kembalian.
 */
export const StrukThermal = ({ transaction, cashierName = 'Petugas Toko' }) => {
  if (!transaction) return null;

  const waktuIso = transaction.tanggal_transaksi || transaction.waktu;
  const waktuStr = waktuIso
    ? new Date(waktuIso).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('id-ID');

  const items = transaction.items || transaction.transaction_details || [];
  const total = transaction.total_harga ?? transaction.total ?? 0;
  const uangDiterima = transaction.uang_bayar ?? transaction.uangDiterima ?? total;
  const kembalian = transaction.kembalian ?? Math.max(0, uangDiterima - total);
  const noStruk = transaction.no_struk || transaction.id || 'TX-BARU';

  return (
    <div id="printable-receipt" className="thermal-receipt">
      <div className="receipt-header">
        <h2 className="shop-title">ALYA FOTOCOPY</h2>
        <p className="shop-subtitle">Layanan Fotokopi, Jilid & ATK</p>
        <p className="shop-address">Jl. Mahasiswa No. 8, Kampus</p>
        <p className="shop-telp">Telp: 0812-3456-7890</p>
      </div>

      <div className="receipt-divider-double">================================</div>

      <div className="receipt-meta">
        <div className="meta-row">
          <span>No. Transaksi :</span>
          <span>#{noStruk}</span>
        </div>
        <div className="meta-row">
          <span>Waktu         :</span>
          <span>{waktuStr}</span>
        </div>
        <div className="meta-row">
          <span>Kasir         :</span>
          <span>{cashierName}</span>
        </div>
      </div>

      <div className="receipt-divider">--------------------------------</div>

      <div className="receipt-items">
        {items.map((it, idx) => {
          const qty = it.quantity || it.qty || 1;
          const harga = it.harga_satuan ?? it.harga ?? 0;
          const subtotal = it.subtotal ?? harga * qty;
          const nama = it.nama || it.nama_barang || it.nama_layanan || 'Barang/Jasa';
          return (
            <div key={idx} className="receipt-item-block">
              <div className="item-name">{nama}</div>
              <div className="item-calc">
                <span>{qty} x {formatRupiah(harga)}</span>
                <span className="item-subtotal">{formatRupiah(subtotal)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="receipt-divider">--------------------------------</div>

      <div className="receipt-summary">
        <div className="summary-row total-row">
          <span>TOTAL :</span>
          <span className="total-val">{formatRupiah(total)}</span>
        </div>
        <div className="summary-row">
          <span>Bayar (Tunai) :</span>
          <span>{formatRupiah(uangDiterima)}</span>
        </div>
        <div className="summary-row">
          <span>Kembalian     :</span>
          <span>{formatRupiah(kembalian)}</span>
        </div>
      </div>

      <div className="receipt-divider-double">================================</div>

      <div className="receipt-footer">
        <p>Terima Kasih Atas Kunjungan Anda</p>
        <p>Barang/Layanan yang sudah diproses</p>
        <p>tidak dapat dibatalkan/ditukar.</p>
        <p className="pos-brand">SISKA - POS System</p>
      </div>
    </div>
  );
};

