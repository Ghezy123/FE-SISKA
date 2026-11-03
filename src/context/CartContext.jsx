import { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Simpan keranjang di localStorage agar tidak hilang saat berpindah antar modul
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('siska_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('siska_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sinkronisasi data barang di keranjang jika ada perubahan harga/stok dari modul Stok
  useEffect(() => {
    const syncWithProducts = () => {
      const products = productService.getProducts();
      setCartItems((prevItems) => {
        return prevItems.map((item) => {
          const fresh = products.find((p) => p.id === item.id);
          if (fresh) {
            return {
              ...item,
              nama: fresh.nama,
              kategori: fresh.kategori,
              harga: fresh.harga,
              stok: fresh.stok,
              quantity: Math.min(item.quantity, fresh.stok > 0 ? fresh.stok : 1),
            };
          }
          return item;
        });
      });
    };

    window.addEventListener('siska_products_updated', syncWithProducts);
    return () => window.removeEventListener('siska_products_updated', syncWithProducts);
  }, []);

  const addToCart = (product, quantityToAdd = 1) => {
    if (product.stok <= 0) return;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantityToAdd;
        if (newQty > product.stok) return prevItems;
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: Math.min(quantityToAdd, product.stok) }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.stok) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('siska_cart');
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.harga * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};
