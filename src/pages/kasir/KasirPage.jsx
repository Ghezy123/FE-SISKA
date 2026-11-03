import { useState, useMemo } from 'react';
import { initialProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { formatRupiah } from '../../utils/helpers';
import './KasirPage.css';

export const KasirPage = () => {
  const [activeTab, setActiveTab] = useState('atk'); // 'atk' | 'cetak'
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, cartItems } = useCart();

  // Daftar Kategori Unik
  const categories = useMemo(() => {
    const list = ['Semua Kategori'];
    initialProducts.forEach((p) => {
      if (!list.includes(p.kategori)) list.push(p.kategori);
    });
    return list;
  }, []);

  // Filter Produk Berdasarkan Pencarian & Kategori
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((item) => {
      const matchCat =
        selectedCategory === 'Semua Kategori' ||
        item.kategori.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Tanggal Hari Ini Sesuai Format Lokal
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="siska-kasir-container">
      {/* Kasir Header */}
      <header className="siska-kasir-header">
        <div className="siska-kasir-title-area">
          <span className="siska-kasir-date">{todayFormatted}</span>
          <h1 className="siska-kasir-title">Kasir</h1>
          <p className="siska-kasir-desc">
            Pilih barang untuk ditambahkan ke keranjang.
          </p>
        </div>
        <div className="siska-store-status-badge">
          <span className="siska-status-dot"></span>
          <span>Toko Buka</span>
        </div>
      </header>

      {/* Mode Switcher Tabs (Barang ATK vs Layanan Cetak) */}
      <div className="siska-mode-tabs">
        <button
          type="button"
          className={`siska-mode-tab ${activeTab === 'atk' ? 'active' : ''}`}
          onClick={() => setActiveTab('atk')}
        >
          <div className="siska-mode-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div className="siska-mode-info">
            <span className="siska-mode-title">Barang ATK</span>
            <span className="siska-mode-sub">Pilih produk alat tulis</span>
          </div>
        </button>

        <button
          type="button"
          className={`siska-mode-tab ${activeTab === 'cetak' ? 'active' : ''}`}
          onClick={() => setActiveTab('cetak')}
        >
          <div className="siska-mode-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
          </div>
          <div className="siska-mode-info">
            <span className="siska-mode-title">Layanan Cetak & Jasa</span>
            <span className="siska-mode-sub">Hitung print, fotokopi, dan jilid</span>
          </div>
        </button>
      </div>

      {activeTab === 'atk' ? (
        <>
          {/* Search & Shortcuts Bar */}
          <div className="siska-search-toolbar">
            <div className="siska-search-box">
              <svg className="siska-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="siska-search-field"
                placeholder="Cari nama barang atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="siska-search-shortcut">⌘ K</span>
            </div>
          </div>

          {/* Categories Filter Pills */}
          <div className="siska-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`siska-category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products List Header */}
          <div className="siska-products-header">
            <h2 className="siska-products-title">Daftar Barang</h2>
            <span className="siska-products-count">
              {filteredProducts.length} barang tersedia
            </span>
          </div>

          {/* Product Grid */}
          <div className="siska-products-grid">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find((i) => i.id === product.id);
              const isLowStock = product.stok <= 5;

              return (
                <div
                  key={product.id}
                  className={`siska-product-card ${inCart ? 'in-cart' : ''}`}
                  onClick={() => addToCart(product)}
                >
                  <div className="siska-card-top">
                    <span className="siska-product-cat">{product.kategori}</span>
                    <span
                      className={`siska-product-stock ${isLowStock ? 'low' : ''}`}
                    >
                      Stok {product.stok}
                    </span>
                  </div>

                  <h3 className="siska-product-name">{product.nama}</h3>

                  <div className="siska-card-bottom">
                    <span className="siska-product-price">
                      {formatRupiah(product.harga)}
                    </span>
                    <button
                      type="button"
                      className="siska-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      title="Tambah ke keranjang"
                    >
                      {inCart ? (
                        <span className="siska-incart-badge">{inCart.quantity}</span>
                      ) : (
                        '+'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Kalkulator Layanan Cetak & Jasa (Frame 6:1403) */
        <div className="siska-layanan-cetak-panel">
          <div className="siska-layanan-cetak-header">
            <h2>Kalkulator Layanan Cetak & Jasa</h2>
            <p>Pilih jenis kertas, warna, dan jilid untuk dihitung secara otomatis.</p>
          </div>
          <div className="siska-layanan-cards">
            <div
              className="siska-service-option"
              onClick={() =>
                addToCart({
                  id: 'srv_print_bw',
                  nama: 'Print Dokumen Hitam Putih (A4)',
                  kategori: 'Jasa Cetak',
                  harga: 500,
                  stok: 999,
                })
              }
            >
              <h3>Print Hitam Putih (A4)</h3>
              <p>Rp 500 / lembar</p>
              <button type="button" className="siska-add-service-btn">+ Tambah ke Keranjang</button>
            </div>

            <div
              className="siska-service-option"
              onClick={() =>
                addToCart({
                  id: 'srv_print_color',
                  nama: 'Print Warna (A4)',
                  kategori: 'Jasa Cetak',
                  harga: 1500,
                  stok: 999,
                })
              }
            >
              <h3>Print Full Warna (A4)</h3>
              <p>Rp 1.500 / lembar</p>
              <button type="button" className="siska-add-service-btn">+ Tambah ke Keranjang</button>
            </div>

            <div
              className="siska-service-option"
              onClick={() =>
                addToCart({
                  id: 'srv_jilid_spiral',
                  nama: 'Jilid Spiral Plastik + Cover',
                  kategori: 'Jilid & Finishing',
                  harga: 7000,
                  stok: 999,
                })
              }
            >
              <h3>Jilid Spiral Plastik</h3>
              <p>Rp 7.000 / buku</p>
              <button type="button" className="siska-add-service-btn">+ Tambah ke Keranjang</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

