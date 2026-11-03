import React, { useEffect, useState, useMemo } from 'react';
import { transaksiService } from '../../services/transaksiService';
import { formatRupiah } from '../../utils/helpers';
import './LaporanPage.css';

/* ─── helper: format tanggal pendek ─── */
function formatWaktu(iso) {
  const d = new Date(iso);
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${tgl}, ${jam}`;
}

/* ─── helper: label hari ─── */
const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

/* ─── Periode options ─── */
const PERIODE = [
  { label: '7 Hari Terakhir', days: 7 },
  { label: '30 Hari Terakhir', days: 30 },
  { label: 'Bulan Ini', days: -1 },
];

const LaporanPage = () => {
  const [semua, setSemua] = useState([]);
  const [periodeIdx, setPeriodeIdx] = useState(0);
  const [showPeriode, setShowPeriode] = useState(false);
  const [lihatSemua, setLihatSemua] = useState(false);
  const [detailTx, setDetailTx] = useState(null);

  const refresh = () => {
    setSemua(transaksiService.getAll());
  };

  useEffect(() => {
    transaksiService.seed(); // inject sample data jika kosong
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('siska_transaksi_updated', handleUpdate);
    return () => window.removeEventListener('siska_transaksi_updated', handleUpdate);
  }, []);

  /* ─── filter berdasarkan periode ─── */
  const filtered = useMemo(() => {
    const days = PERIODE[periodeIdx].days;
    if (days === -1) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return semua.filter((t) => new Date(t.waktu) >= startOfMonth);
    }
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return semua.filter((t) => new Date(t.waktu) >= cutoff);
  }, [semua, periodeIdx]);

  /* ─── Statistik ─── */
  const totalOmzet = useMemo(() => filtered.reduce((s, t) => s + t.total, 0), [filtered]);
  const totalTransaksi = filtered.length;
  const totalBarang = useMemo(() => filtered.reduce((s, t) => s + t.jumlahBarang, 0), [filtered]);

  /* ─── Data grafik 7 hari ─── */
  const chartData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toDateString();
      const total = filtered
        .filter((t) => new Date(t.waktu).toDateString() === dayStr)
        .reduce((s, t) => s + t.total, 0);
      return { label: HARI[d.getDay()], total };
    });
  }, [filtered]);

  const maxChart = Math.max(...chartData.map((d) => d.total), 1);

  /* ─── Format axis label ─── */
  function fmtAxis(val) {
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)} jt`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)} rb`;
    return String(val);
  }

  /* ─── SVG Chart ─── */
  const W = 851, H = 196;
  const PAD = { top: 16, right: 8, bottom: 28, left: 0 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = chartData.length;
  const pts = chartData.map((d, i) => ({
    x: PAD.left + (i / (n - 1)) * chartW,
    y: PAD.top + chartH - (d.total / maxChart) * chartH,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = [
    `M${pts[0].x.toFixed(1)},${(PAD.top + chartH).toFixed(1)}`,
    ...pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `L${pts[pts.length - 1].x.toFixed(1)},${(PAD.top + chartH).toFixed(1)}`,
    'Z',
  ].join(' ');

  /* ─── Riwayat transaksi terbaru ─── */
  const riwayat = lihatSemua ? filtered : filtered.slice(0, 8);

  return (
    <div className="laporan-page">
      {/* ── Header ── */}
      <div className="lap-header">
        <div className="lap-header-left">
          <span className="lap-eyebrow">RINGKASAN BISNIS</span>
          <h1 className="lap-title">Laporan &amp; Riwayat</h1>
          <p className="lap-subtitle">Pantau performa penjualan toko Anda.</p>
        </div>
        {/* Periode selector */}
        <div className="lap-periode-wrap">
          <button className="lap-periode-btn" onClick={() => setShowPeriode((v) => !v)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>
              <span className="lap-periode-label">Periode</span>
              <strong className="lap-periode-value">{PERIODE[periodeIdx].label}</strong>
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showPeriode && (
            <div className="lap-periode-dropdown">
              {PERIODE.map((p, i) => (
                <button
                  key={p.label}
                  className={`lap-periode-option ${i === periodeIdx ? 'active' : ''}`}
                  onClick={() => { setPeriodeIdx(i); setShowPeriode(false); }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="lap-stats-grid">
        {/* Omzet */}
        <div className="lap-stat-card">
          <div className="lap-stat-icon" style={{ background: '#eff6ff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div className="lap-stat-body">
            <span className="lap-stat-label">Total Omzet</span>
            <span className="lap-stat-value">{formatRupiah(totalOmzet)}</span>
            <span className="lap-stat-growth">↑ 12,5% dari minggu lalu</span>
          </div>
        </div>
        {/* Transaksi */}
        <div className="lap-stat-card">
          <div className="lap-stat-icon" style={{ background: '#f0fdf4' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="12" y2="17" />
            </svg>
          </div>
          <div className="lap-stat-body">
            <span className="lap-stat-label">Total Transaksi</span>
            <span className="lap-stat-value">{totalTransaksi}</span>
            <span className="lap-stat-growth">↑ 8,2% dari minggu lalu</span>
          </div>
        </div>
        {/* Barang */}
        <div className="lap-stat-card">
          <div className="lap-stat-icon" style={{ background: '#fffbeb' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className="lap-stat-body">
            <span className="lap-stat-label">Barang Terjual</span>
            <span className="lap-stat-value">{totalBarang}</span>
            <span className="lap-stat-growth">↑ 6,4% dari minggu lalu</span>
          </div>
        </div>
      </div>

      {/* ── Chart: Tren Pendapatan ── */}
      <div className="lap-chart-card">
        <div className="lap-chart-header">
          <div>
            <h2 className="lap-chart-title">Tren Pendapatan</h2>
            <p className="lap-chart-sub">Total pendapatan per hari</p>
          </div>
          <div className="lap-chart-legend">
            <span className="lap-chart-dot" />
            <span className="lap-chart-legend-label">Omzet</span>
          </div>
        </div>

        {/* SVG chart */}
        <div className="lap-chart-body">
          {/* Y-axis labels */}
          <div className="lap-y-axis">
            {[maxChart, maxChart * 0.75, maxChart * 0.5, maxChart * 0.25, 0].map((v, i) => (
              <span key={i} className="lap-y-label">{fmtAxis(Math.round(v))}</span>
            ))}
          </div>
          <div className="lap-svg-wrap">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
                const y = PAD.top + chartH * (1 - frac);
                return <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="#eef0f3" strokeWidth="1" />;
              })}
              {/* Area fill */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#chartGrad)" />
              {/* Line */}
              <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Dots */}
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb" />
              ))}
            </svg>
            {/* X-axis labels */}
            <div className="lap-x-axis">
              {chartData.map((d, i) => (
                <span key={i} className="lap-x-label">{d.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Riwayat Transaksi ── */}
      <div className="lap-riwayat-card">
        <div className="lap-riwayat-header">
          <div>
            <h2 className="lap-riwayat-title">Riwayat Transaksi</h2>
            <p className="lap-riwayat-sub">Daftar transaksi terbaru</p>
          </div>
          <button
            className="btn-lihat-semua"
            onClick={() => setLihatSemua((v) => !v)}
          >
            {lihatSemua ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua'}
          </button>
        </div>

        <table className="lap-table">
          <thead>
            <tr>
              <th>ID TRANSAKSI</th>
              <th>WAKTU</th>
              <th>JUMLAH BARANG</th>
              <th>TOTAL BELANJA</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.length === 0 ? (
              <tr>
                <td colSpan={5} className="lap-empty">Belum ada transaksi</td>
              </tr>
            ) : (
              riwayat.map((t) => (
                <tr key={t.id}>
                  <td className="lap-cell-id">{t.id}</td>
                  <td className="lap-cell-waktu">
                    <span className="lap-waktu-inner">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatWaktu(t.waktu)}
                    </span>
                  </td>
                  <td className="lap-cell-barang">{t.jumlahBarang} barang</td>
                  <td className="lap-cell-total">{formatRupiah(t.total)}</td>
                  <td>
                    <button
                      className="btn-detail"
                      aria-label={`Detail transaksi ${t.id}`}
                      onClick={() => setDetailTx(t)}
                    >
                      Detail
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal Detail Transaksi ── */}
      {detailTx && (
        <div className="modal-backdrop" onClick={() => setDetailTx(null)}>
          <div className="modal-dialog modal-dialog-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <span className="modal-eyebrow">DETAIL TRANSAKSI</span>
                <h2 className="modal-title">{detailTx.id}</h2>
                <p className="modal-subtitle">{formatWaktu(detailTx.waktu)}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setDetailTx(null)} aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#6b7280' }}>
                    <th style={{ padding: '10px 12px' }}>BARANG</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>QTY</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>HARGA</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {detailTx.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>{item.nama}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#4b5563' }}>{item.qty}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#6b7280' }}>{formatRupiah(item.harga)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#111827' }}>
                        {formatRupiah(item.subtotal || item.harga * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                  <span>Total {detailTx.jumlahBarang} Barang</span>
                  <strong style={{ color: '#0f172a', fontSize: '15px' }}>{formatRupiah(detailTx.total)}</strong>
                </div>
                {detailTx.uangDiterima !== undefined && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                      <span>Uang Diterima</span>
                      <span style={{ color: '#0f172a' }}>{formatRupiah(detailTx.uangDiterima)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>
                      <span>Kembalian</span>
                      <span>{formatRupiah(detailTx.kembalian)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-batal"
                style={{ width: '100%' }}
                onClick={() => setDetailTx(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaporanPage;
