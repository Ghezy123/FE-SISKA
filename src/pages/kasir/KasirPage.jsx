import { useState, useMemo, useEffect } from 'react';
import { productService } from '../../services/productService';
import { layananService } from '../../services/layananService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatRupiah } from '../../utils/helpers';
import './KasirPage.css';

export const KasirPage = () => {
  const { warning, success } = useToast();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('atk'); // 'atk' | 'cetak'
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceQty, setServiceQty] = useState({}); // { srv_id: qty }
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

  // Daftar Kategori Unik dari data produk aktif (Tinta Printer sudah dihilangkan)
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
    const qty = Number(serviceQty[srv.id]) || 1;
    if (qty <= 0) {
      warning('Jumlah lembar/buku minimal 1');
      return;
    }
    addToCart(
      {
        id: srv.id,
        nama: srv.nama,
        kategori: srv.kategori,
        harga: srv.harga,
        satuan: srv.satuan || 'lembar',
        stok: 999999,
        isService: true,
      },
      qty
    );
    success(`${srv.nama} (${qty} ${srv.satuan || 'lembar'}) ditambahkan ke keranjang`);
    // Reset qty
    setServiceQty((prev) => ({ ...prev, [srv.id]: 1 }));
  };

  return (
    <div className="siska-kasir-container">
      {/* Kasir Header */}
      <header className="siska-kasir-header">
        <div className="siska-kasir-title-area">
          <span className="siska-kasir-date">{todayFormatted}</span>
          <h1 className="siska-kasir-title">Kasir</h1>
          <p className="siska-kasir-desc">
            Pilih barang ATK atau hitung layanan fotokopi & jasa cetak.
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
            <span className="siska-mode-sub">Pilih produk alat tulis & kertas</span>
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
            <span className="siska-mode-sub">Hitung print, fotokopi, laminating, jilid</span>
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
        </>
      ) : (
        /* Kalkulator Layanan Cetak & Jasa (SRS Tabel 4 & Frame 6:1403) */
        <div className="siska-layanan-cetak-panel">
          <div className="siska-layanan-cetak-header">
            <h2>Kalkulator Layanan Cetak & Jasa (Alya Fotocopy)</h2>
            <p>Masukkan jumlah lembar, halaman, atau buku untuk kalkulasi biaya instan ke kasir.</p>
          </div>
          <div className="siska-layanan-cards">
            {services.map((srv) => {
              const currentQty = serviceQty[srv.id] || 1;
              const subtotalCalc = srv.harga * currentQty;

              return (
                <div key={srv.id} className="siska-service-option">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>
                        {srv.kategori}
                      </span>
                      <h3 style={{ margin: '4px 0 2px' }}>{srv.nama}</h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                        {formatRupiah(srv.harga)} / {srv.satuan}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f8fafc',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                      Jumlah ({srv.satuan}):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={currentQty}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setServiceQty((prev) => ({ ...prev, [srv.id]: val }));
                      }}
                      style={{
                        width: '70px',
                        height: '32px',
                        padding: '0 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: '700',
                        textAlign: 'center',
                      }}
                    />
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Subtotal:</span>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{formatRupiah(subtotalCalc)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="siska-add-service-btn"
                    style={{ marginTop: '12px' }}
                    onClick={() => handleAddService(srv)}
                  >
                    + Tambah ke Keranjang
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
