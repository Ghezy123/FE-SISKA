import React, { useEffect, useState, useMemo } from 'react';
import { productService } from '../../services/productService';
import { formatRupiah } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import ModalTambahBarang from '../../components/stok/ModalTambahBarang';
import ModalUpdateHarga from '../../components/stok/ModalUpdateHarga';
import ModalUpdateStok from '../../components/stok/ModalUpdateStok';
import ModalMauUpdateApa from '../../components/stok/ModalMauUpdateApa';
import ModalKonfirmasiHapus from '../../components/stok/ModalKonfirmasiHapus';
import './StokPage.css';

const ITEMS_PER_PAGE = 8;

const StokPage = () => {
  const { success } = useToast();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua Kategori');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [modalTambah, setModalTambah] = useState(false);
  const [modalUpdateApa, setModalUpdateApa] = useState(null);
  const [modalUpdateHarga, setModalUpdateHarga] = useState(null);
  const [modalUpdateStok, setModalUpdateStok] = useState(null);
  const [modalHapus, setModalHapus] = useState(null);

  const refresh = () => {
    setProducts(productService.getProducts());
  };

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener('siska_products_updated', handleUpdate);
    return () => window.removeEventListener('siska_products_updated', handleUpdate);
  }, []);

  /* ──────────── Filtering & Pagination ──────────── */
  const kategoriList = useMemo(
    () => ['Semua Kategori', ...Array.from(new Set(products.map((p) => p.kategori))).sort()],
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch = p.nama.toLowerCase().includes(q) || (p.kode && p.kode.toLowerCase().includes(q));
      const matchKat = filterKategori === 'Semua Kategori' || p.kategori === filterKategori;
      return matchSearch && matchKat;
    });
  }, [products, search, filterKategori]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  /* ──────────── CRUD handlers ──────────── */
  const handleSaveTambah = (newProduct) => {
    productService.tambahBarang(newProduct, 'Admin Toko');
    setModalTambah(false);
    refresh();
    success('Barang baru berhasil disimpan');
  };

  const handleSaveHarga = (updatedProduct) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    productService.saveProducts(updated);
    setModalUpdateHarga(null);
    refresh();
    success('Harga barang berhasil diperbarui');
  };

  const handleSaveStok = (product, tambahQty, catatan) => {
    productService.restokBarang(product.id, tambahQty, 'Admin Toko', catatan);
    setModalUpdateStok(null);
    refresh();
    success(`Stok ${product.nama} berhasil ditambahkan (+${tambahQty})`);
  };

  const handleHapus = (product) => {
    productService.hapusBarang(product.id);
    setModalHapus(null);
    refresh();
    success(`Barang "${product.nama}" berhasil dihapus`);
  };

  /* ──────────── Stok badge coloring (BRD & SRS Peringatan Stok) ──────────── */
  const getStokStyle = (stok, minStok = 5) => {
    if (stok <= 0) return { bg: '#fee2e2', color: '#dc2626', label: 'Habis' };
    if (stok <= minStok) return { bg: '#fefce8', color: '#a16207', label: `${stok}` };
    return { bg: '#f0fdf4', color: '#15803d', label: `${stok}` };
  };

  /* ──────────── Render ──────────── */
  return (
    <div className="stok-page">
      {/* ── Header ── */}
      <div className="stok-header">
        <div className="stok-header-left">
          <span className="stok-eyebrow">INVENTORI</span>
          <h1 className="stok-title">Manajemen Stok</h1>
          <p className="stok-subtitle">Kelola barang, harga, dan jumlah stok toko.</p>
        </div>
        <button className="btn-tambah" onClick={() => setModalTambah(true)} aria-label="Tambah barang baru">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Barang Baru
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="stok-toolbar">
        <div className="stok-search">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari kode atau nama barang..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
          <span className="search-kbd">⌘ K</span>
        </div>
        <div className="stok-kategori-select">
          <select
            value={filterKategori}
            onChange={(e) => { setFilterKategori(e.target.value); setCurrentPage(1); }}
            className="kategori-select"
          >
            {kategoriList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <svg className="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="stok-table-wrapper">
        <table className="stok-table">
          <thead>
            <tr>
              <th>KODE</th>
              <th>NAMA BARANG</th>
              <th>KATEGORI</th>
              <th>HARGA BELI</th>
              <th>HARGA JUAL</th>
              <th>STOK</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">Tidak ada barang ditemukan</td>
              </tr>
            ) : (
              paginated.map((p) => {
                const st = getStokStyle(p.stok, p.stok_minimal);
                return (
                  <tr key={p.id}>
                    <td className="cell-kode">{p.kode || '-'}</td>
                    <td className="cell-nama">
                      <div>{p.nama}</div>
                      <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '400' }}>
                        Min. {p.stok_minimal || 5} {p.satuan || 'Pcs'}
                      </span>
                    </td>
                    <td>
                      <span className="kategori-badge">{p.kategori}</span>
                    </td>
                    <td className="cell-harga-beli">{formatRupiah(p.hargaBeli ?? p.harga)}</td>
                    <td className="cell-harga-jual">{formatRupiah(p.harga)}</td>
                    <td>
                      <button
                        type="button"
                        className="stok-badge"
                        style={{
                          background: st.bg,
                          color: st.color,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        onClick={() => setModalUpdateStok(p)}
                        title="Klik untuk tambah stok"
                      >
                        {p.stok <= 0 ? 'Habis (0)' : `${p.stok} ${p.satuan || 'unit'}`}
                      </button>
                    </td>
                    <td>
                      <div className="aksi-group">
                        <button
                          className="btn-update"
                          onClick={() => setModalUpdateApa(p)}
                          aria-label={`Update ${p.nama}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                          Update
                        </button>
                        <button
                          className="btn-hapus"
                          onClick={() => setModalHapus(p)}
                          aria-label={`Hapus ${p.nama}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M10 11v6" /><path d="M14 11v6" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ── Pagination ── */}
        <div className="stok-pagination">
          <span className="pagination-info">
            Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} barang
          </span>
          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              aria-label="Halaman sebelumnya"
            >←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`page-btn ${n === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages || filtered.length === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              aria-label="Halaman berikutnya"
            >→</button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modalTambah && (
        <ModalTambahBarang
          onClose={() => setModalTambah(false)}
          onSave={handleSaveTambah}
        />
      )}

      {modalUpdateApa && (
        <ModalMauUpdateApa
          product={modalUpdateApa}
          onClose={() => setModalUpdateApa(null)}
          onUpdateHarga={(p) => { setModalUpdateApa(null); setModalUpdateHarga(p); }}
          onUpdateStok={(p) => { setModalUpdateApa(null); setModalUpdateStok(p); }}
        />
      )}

      {modalUpdateHarga && (
        <ModalUpdateHarga
          product={modalUpdateHarga}
          onClose={() => setModalUpdateHarga(null)}
          onSave={handleSaveHarga}
        />
      )}

      {modalUpdateStok && (
        <ModalUpdateStok
          product={modalUpdateStok}
          onClose={() => setModalUpdateStok(null)}
          onSave={handleSaveStok}
        />
      )}

      {modalHapus && (
        <ModalKonfirmasiHapus
          product={modalHapus}
          onClose={() => setModalHapus(null)}
          onHapus={handleHapus}
        />
      )}
    </div>
  );
};

export default StokPage;
