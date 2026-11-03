import { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';

export const MainLayout = ({ activePage, onNavigate, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="siska-layout-container">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
      />
      <div className={`siska-main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="siska-content-body">{children}</main>
      </div>
    </div>
  );
};

