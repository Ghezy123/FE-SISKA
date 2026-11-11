import { useState, useMemo, useEffect } from 'react';
import { productService } from '../../services/productService';
import { layananService } from '../../services/layananService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatRupiah } from '../../utils/helpers';
import CurrencyInput from '../../components/common/CurrencyInput';
import './KasirPage.css';

const ATK_ITEMS_PER_PAGE = 8;

export const KasirPage = () => {
  const { warning, success } = useToast();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('atk'); // 'atk' | 'cetak'
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceNominal, setServiceNominal] = useState({}); // { [srv.id]: nominalBayar }
  const [selectedUnits, setSelectedUnits] = useState({}); // { [productId]: chosenUnitOption }
  const { addToCart, cartItems } = useCart();

  // Load produk dari productService dan pasang listener update real-time
  const loadProducts = () => {
    setProducts(productService.getProducts());
  };

  const loadServices = () => {
    setServices(layananService.getServices());
  };

  useEffect(() => {
    loadProducts();
    loadServices();

    const handleProductUpdate = () => loadProducts();
    const handleServiceUpdate = () => loadServices();

    window.addEventListener('siska_products_updated', handleProductUpdate);
    window.addEventListener('siska_services_updated', handleServiceUpdate);

    return () => {
      window.removeEventListener('siska_products_updated', handleProductUpdate);
      window.removeEventListener('siska_services_updated', handleServiceUpdate);
    };
  }, []);

  const getActiveUnit = (product) => {
    if (selectedUnits[product.id]) return selectedUnits[product.id];
    if (product.satuan_opsi && product.satuan_opsi.length > 0) return product.satuan_opsi[0];
    return { nama: product.satuan || 'Pcs', pengali: 1, harga: product.harga, label: product.satuan || 'Pcs' };
  };

  // Daftar Kategori Unik dari data produk aktif
  const categories = useMemo(() => {
    const list = ['Semua Kategori'];
    products.forEach((p) => {
      if (p.kategori && p.kategori !== 'Tinta Printer' && !list.includes(p.kategori)) {
        list.push(p.kategori);
      }
    });
    return list;
  }, [products]);

  // Filter Produk Berdasarkan Pencarian & Kategori
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat =
        selectedCategory === 'Semua Kategori' ||
        item.kategori.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.kode && item.kode.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Reset pagination ke halaman 1 setiap kali kategori atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ATK_ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (validCurrentPage - 1) * ATK_ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ATK_ITEMS_PER_PAGE);
  }, [filteredProducts, validCurrentPage]);

  // Tanggal Hari Ini Sesuai Format Lokal
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  const handleAddProduct = (product, unitToUse = null) => {
    if (product.stok <= 0) {
      warning('Stok barang habis');
      return;
    }
    const activeUnit = unitToUse || getActiveUnit(product);
    const needed = activeUnit.pengali || 1;

    // Hitung total unit fisik yang sudah masuk keranjang untuk barang ini
    const currentUsed = cartItems
      .filter((i) => i.id === product.id)
      .reduce((sum, i) => sum + (i.quantity * (i.pengali || 1)), 0);

    if (currentUsed + needed > product.stok) {
      warning(`Stok tidak mencukupi (sisa ${product.stok - currentUsed} ${product.satuan || 'unit'})`);
      return;
    }

    addToCart(product, 1, activeUnit);
    success(`${product.nama} (${activeUnit.label || activeUnit.nama}) ditambahkan`);
  };

  const handleAddService = (srv) => {
    const nominal = Number(serviceNominal[srv.id]);
    if (!nominal || nominal <= 0) {
      warning(`Masukkan nominal total pembayaran untuk ${srv.nama}`);
      return;
    }
    addToCart(
      {
        id: srv.id,
        nama: srv.nama,
        kategori: srv.kategori,
        harga: nominal,
        satuan: '',
        stok: 999999,
        isService: true,
      },
      1
    );
    success(`${srv.nama} (${formatRupiah(nominal)}) ditambahkan ke keranjang`);
    // Kosongkan kembali input setelah ditambahkan
    setServiceNominal((prev) => ({ ...prev, [srv.id]: '' }));
  };

  return (
    <div className="siska-kasir-container">
      {/* Kasir Header */}
      <header className="siska-kasir-header">
        <div className="siska-kasir-title-area">
          <span className="siska-kasir-date">{todayFormatted}</span>
          <h1 className="siska-kasir-title">Kasir</h1>
          <p className="siska-kasir-desc">
            Pilih barang ATK atau hitung layanan fotokopi &amp; jasa cetak.
          </p>
        </div>
        <div className="siska-store-status-badge">
          <span className="siska-status-dot"></span>
          <span>Alya Fotocopy • Buka</span>
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
            <span className="siska-mode-sub">Pilih produk alat tulis &amp; kertas</span>
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
            <span className="siska-mode-title">Layanan Cetak &amp; Jasa</span>
            <span className="siska-mode-sub">Print, fotokopi, laminating</span>
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
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '14px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 600, color: '#334155' }}>Belum ada data barang</p>
              <p style={{ margin: 0, fontSize: '13px' }}>Tambahkan barang melalui menu Stok Barang atau tunggu sinkronisasi dengan server backend.</p>
            </div>
          ) : (
            <div className="siska-products-grid">
              {paginatedProducts.map((product) => {
                const activeUnit = getActiveUnit(product);
                const currentUsed = cartItems
                  .filter((i) => i.id === product.id)
                  .reduce((sum, i) => sum + (i.quantity * (i.pengali || 1)), 0);
                const needed = activeUnit.pengali || 1;
                const isOutOfStock = product.stok <= 0;
                const isLowStock = product.stok > 0 && product.stok <= (product.stok_minimal || 5);
                const isMaxInCart = currentUsed + needed > product.stok;
                const hasMultipleUnits = product.satuan_opsi && product.satuan_opsi.length > 1;

                const itemKey = `${product.id}_${activeUnit.nama}`;
                const inCartItem = cartItems.find((i) => i.itemKey === itemKey);
                const anyInCart = cartItems.some((i) => i.id === product.id);

                return (
                  <div
                    key={product.id}
                    className={`siska-product-card ${anyInCart ? 'in-cart' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                    onClick={() => handleAddProduct(product, activeUnit)}
                    style={{
                      opacity: isOutOfStock ? 0.6 : 1,
                      cursor: isOutOfStock || isMaxInCart ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div className="siska-card-top">
                      <span className="siska-product-cat">{product.kategori}</span>
                      <span
                        className={`siska-product-stock ${isOutOfStock ? 'empty' : isLowStock ? 'low' : ''}`}
                        style={{
                          background: isOutOfStock ? '#fee2e2' : undefined,
                          color: isOutOfStock ? '#dc2626' : undefined,
                        }}
                      >
                        {isOutOfStock
                          ? 'Habis'
                          : isLowStock
                          ? `Menipis (${product.stok - currentUsed})`
                          : `Stok: ${product.stok - currentUsed} ${product.satuan || ''}`}
                      </span>
                    </div>

                    <h3 className="siska-product-name">{product.nama}</h3>

                    {/* Multi-Satuan / Borongan Selector Pills (Mendukung hingga 3 Tingkatan) */}
                    {hasMultipleUnits && (
                      <div
                        className="siska-card-unit-selector"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.satuan_opsi.map((opt) => {
                          const shortName = opt.namaSatuan || opt.nama?.split(' ')[0] || opt.nama;
                          const isUnitActive = activeUnit.nama === opt.nama;
                          return (
                            <button
                              key={opt.nama}
                              type="button"
                              className={`siska-card-unit-pill ${isUnitActive ? 'active' : ''}`}
                              onClick={() => setSelectedUnits((prev) => ({ ...prev, [product.id]: opt }))}
                              title={`${opt.label || opt.nama} (${opt.pengali}x = ${formatRupiah(opt.harga)})`}
                            >
                              {shortName}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="siska-card-bottom">
                      <div className="siska-product-price-wrap">
                        <span className="siska-product-price">
                          {formatRupiah(activeUnit.harga)}
                        </span>
                        <span className="siska-unit-subtext">
                          /{activeUnit.namaSatuan || activeUnit.nama?.split(' ')[0] || activeUnit.nama}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="siska-add-btn"
                        disabled={isOutOfStock || isMaxInCart}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddProduct(product, activeUnit);
                        }}
                        title={isOutOfStock ? 'Stok habis' : isMaxInCart ? 'Maksimal stok tercapai' : `Tambah ${activeUnit.label || activeUnit.nama} ke keranjang`}
                        style={{
                          opacity: isOutOfStock || isMaxInCart ? 0.5 : 1,
                          cursor: isOutOfStock || isMaxInCart ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {inCartItem ? (
                          <span className="siska-incart-badge">{inCartItem.quantity}</span>
                        ) : (
                          '+'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination ATK (Muncul jika barang lebih dari batas tertentu / ATK_ITEMS_PER_PAGE) */}
          {totalPages > 1 && (
            <div className="siska-atk-pagination">
              <span className="siska-pagination-info">
                Menampilkan <strong>{(validCurrentPage - 1) * ATK_ITEMS_PER_PAGE + 1}</strong>-<strong>{Math.min(validCurrentPage * ATK_ITEMS_PER_PAGE, filteredProducts.length)}</strong> dari <strong>{filteredProducts.length}</strong> barang
              </span>
              <div className="siska-pagination-controls">
                <button
                  type="button"
                  className="siska-page-btn siska-page-nav-btn"
                  disabled={validCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Halaman sebelumnya"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span>Prev</span>
                </button>

                <div className="siska-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`siska-page-btn siska-page-num ${n === validCurrentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="siska-page-btn siska-page-nav-btn"
                  disabled={validCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Halaman berikutnya"
                >
                  <span>Next</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Layanan Cetak & Jasa (3 Opsi: Print, Fotokopi, Laminating - Langsung Masukkan Total Nominal) */
        <div className="siska-layanan-cetak-panel">
          <div className="siska-layanan-header-v4">
            <h2>Layanan Cetak &amp; Jasa (Alya Fotocopy)</h2>
            <p>Pilih layanan, masukkan nominal total pembayaran pelanggan, lalu klik tambah ke keranjang.</p>
          </div>

          <div className="siska-layanan-grid-pure">
            {services.map((srv) => {
              const currentNominal = serviceNominal[srv.id] || '';
              const numVal = Number(currentNominal) || 0;

              const presets =
                srv.id === 'srv_fotokopi'
                  ? [500, 1000, 2000, 3000, 5000, 10000]
                  : srv.id === 'srv_laminating'
                  ? [2000, 4000, 5000, 8000, 10000, 20000]
                  : [500, 1000, 2000, 5000, 10000, 20000];

              return (
                <div key={srv.id} className="siska-service-pure-card">
                  {/* Card Header */}
                  <div className="siska-service-pure-top">
                    <div className={`siska-service-pure-icon icon-${srv.id}`}>
                      {srv.id === 'srv_print' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 6 2 18 2 18 9" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                        </svg>
                      )}
                      {srv.id === 'srv_fotokopi' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                      {srv.id === 'srv_laminating' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                      )}
                    </div>
                    <div className="siska-service-pure-info">
                      <span className="siska-service-pure-cat">{srv.kategori}</span>
                      <h3 className="siska-service-pure-title">{srv.nama}</h3>
                      <span className="siska-service-pure-desc">{srv.deskripsi}</span>
                    </div>
                  </div>

                  {/* Input Nominal Total Bayar */}
                  <div className="siska-service-pure-input-section">
                    <label className="siska-service-pure-label">Nominal Total Bayar</label>
                    <div className="siska-service-pure-input-wrapper">
                      <span className="siska-service-pure-prefix">Rp</span>
                      <CurrencyInput
                        className="siska-service-pure-input"
                        value={currentNominal}
                        onChange={(raw) => setServiceNominal((prev) => ({ ...prev, [srv.id]: raw }))}
                        placeholder="0"
                        min={0}
                      />
                    </div>

                    {/* Quick Preset Chips */}
                    <div className="siska-service-pure-chips">
                      {presets.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className={`siska-service-pure-chip ${numVal === amt ? 'active' : ''}`}
                          onClick={() => setServiceNominal((prev) => ({ ...prev, [srv.id]: amt }))}
                        >
                          {formatRupiah(amt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Button Tambah ke Keranjang */}
                  <button
                    type="button"
                    className="siska-service-pure-btn"
                    disabled={numVal <= 0}
                    onClick={() => handleAddService(srv)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Tambah ke Keranjang</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
