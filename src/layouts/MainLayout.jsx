import { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { CartSidebar } from '../components/kasir/CartSidebar';
import './MainLayout.css';

export const MainLayout = ({ activePage, onNavigate, onCheckout, children }) => {
  const [sidebarOpen] = useState(true);

  return (
    <div className={`siska-pos-shell ${activePage === 'kasir' ? 'kasir-mode' : ''}`}>
      {/* Kolom 1: Navigasi Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
      />

      {/* Kolom 2: Konten Halaman */}
      <main className="siska-pos-center">
        {children}
      </main>

      {/* Kolom 3: Keranjang Sidebar (Tampil di menu Kasir) */}
      {activePage === 'kasir' && (
        <CartSidebar onCheckout={onCheckout} />
      )}
    </div>
  );
};
