import { useCart } from '../../context/CartContext';
import { formatRupiah } from '../../utils/helpers';
import './CartSidebar.css';

export const CartSidebar = ({ onCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems } = useCart();

  return (
    <aside className="siska-cart-sidebar">
      {/* Header */}
      <div className="siska-cart-header">
        <div className="siska-cart-title-wrap">
          <h2 className="siska-cart-title">Keranjang</h2>
          <span className="siska-cart-badge">{totalItems} barang</span>
        </div>
        {cartItems.length > 0 && (
          <button
            type="button"
            className="siska-cart-clear-btn"
            onClick={clearCart}
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="siska-cart-items-container">
        {cartItems.length === 0 ? (
          <div className="siska-cart-empty">
            <div className="siska-empty-cart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3 className="siska-empty-title">Keranjang Kosong</h3>
            <p className="siska-empty-desc">
              Pilih barang di sebelah kiri untuk mulai transaksi kasir.
            </p>
          </div>
        ) : (
          <div className="siska-cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="siska-cart-item">
                <div className="siska-cart-item-info">
                  <span className="siska-cart-item-name">{item.nama}</span>
                  <span className="siska-cart-item-price">
                    {formatRupiah(item.harga)}
                  </span>
                </div>

                <div className="siska-cart-item-bottom">
                  {/* Quantity Controls */}
                  <div className="siska-qty-controls">
                    <button
                      type="button"
                      className="siska-qty-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                      title="Kurangi"
                    >
                      −
                    </button>
                    <span className="siska-qty-number">{item.quantity}</span>
                    <button
                      type="button"
                      className="siska-qty-btn"
                      disabled={item.quantity >= item.stok}
                      onClick={() => updateQuantity(item.id, 1)}
                      title="Tambah"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="siska-cart-item-subtotal-wrap">
                    <span className="siska-cart-item-subtotal">
                      {formatRupiah(item.harga * item.quantity)}
                    </span>
                    <button
                      type="button"
                      className="siska-item-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Hapus barang"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary & Checkout */}
      <div className="siska-cart-footer">
        <div className="siska-summary-row">
          <span className="siska-summary-label">Subtotal</span>
          <span className="siska-summary-val">{formatRupiah(totalAmount)}</span>
        </div>
        <div className="siska-summary-row total">
          <span className="siska-total-label">Total</span>
          <span className="siska-total-val">{formatRupiah(totalAmount)}</span>
        </div>

        <button
          type="button"
          className="siska-checkout-btn"
          disabled={cartItems.length === 0}
          onClick={onCheckout}
        >
          <span>Bayar Sekarang</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

