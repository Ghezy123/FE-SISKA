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
          if (item.isService) return item;
          const fresh = products.find((p) => p.id === item.id);
          if (fresh) {
            return {
              ...item,
              stok: fresh.stok,
            };
          }
          return item;
        });
      });
    };

    window.addEventListener('siska_products_updated', syncWithProducts);
    return () => window.removeEventListener('siska_products_updated', syncWithProducts);
  }, []);

  const addToCart = (product, quantityToAdd = 1, chosenUnit = null) => {
    const unitName = chosenUnit ? chosenUnit.nama : (product.satuan || 'Pcs');
    const unitPrice = chosenUnit ? chosenUnit.harga : product.harga;
    const pengali = chosenUnit ? (chosenUnit.pengali || 1) : (product.pengali || 1);
    const itemKey = `${product.id}_${unitName}`;

    setCartItems((prevItems) => {
      // Cek total stok fisik yang sudah terpakai untuk produk ini di keranjang
      if (!product.isService) {
        const currentUsage = prevItems
          .filter((it) => it.id === product.id)
          .reduce((sum, it) => sum + (it.quantity * (it.pengali || 1)), 0);

        const needed = quantityToAdd * pengali;
        if (currentUsage + needed > product.stok) {
          return prevItems; // Stok fisik tidak cukup
        }
      }

      const existing = prevItems.find((item) => (item.itemKey || item.id) === itemKey);
      if (existing) {
        return prevItems.map((item) =>
          (item.itemKey || item.id) === itemKey
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      const newItem = {
        ...product,
        itemKey,
        satuan: unitName,
        harga: unitPrice,
        pengali,
        quantity: quantityToAdd,
      };

      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (itemKeyOrId, delta) => {
    setCartItems((prevItems) => {
      const targetItem = prevItems.find((it) => (it.itemKey || it.id) === itemKeyOrId);
      if (!targetItem) return prevItems;

      if (delta > 0 && !targetItem.isService) {
        const currentUsage = prevItems
          .filter((it) => it.id === targetItem.id)
          .reduce((sum, it) => sum + (it.quantity * (it.pengali || 1)), 0);

        const needed = delta * (targetItem.pengali || 1);
        if (currentUsage + needed > targetItem.stok) {
          return prevItems; // Tidak boleh melebihi sisa stok fisik
        }
      }

      return prevItems
        .map((item) => {
          if ((item.itemKey || item.id) === itemKeyOrId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemKeyOrId) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.itemKey || item.id) !== itemKeyOrId));
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
