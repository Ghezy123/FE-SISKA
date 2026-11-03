import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Initial cart dengan 2 item persis seperti di Frame 6:78 Figma
  const [cartItems, setCartItems] = useState([
    {
      id: 'prd_02',
      nama: 'Pena Standard AE7',
      kategori: 'Alat Tulis',
      harga: 3000,
      stok: 4,
      quantity: 2,
    },
    {
      id: 'prd_03',
      nama: 'Buku Tulis 38 Lembar',
      kategori: 'Buku',
      harga: 5000,
      stok: 24,
      quantity: 1,
    },
  ]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stok) return prevItems;
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
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

