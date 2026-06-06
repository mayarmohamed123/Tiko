import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/dashboard/AdminSidebar';
import { AdminFooter } from '../components/dashboard/AdminFooter';
import { Menu } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let activeTab = 'overview';
  if (currentPath.includes('/orders')) {
    activeTab = 'orders';
  } else if (currentPath.includes('/products')) {
    activeTab = 'products';
  } else if (currentPath.includes('/customers')) {
    activeTab = 'customers';
  } else if (currentPath.includes('/settings')) {
    activeTab = 'settings';
  }

  return (
    <div className="min-h-screen bg-tiko-background text-tiko-on-surface flex flex-col md:flex-row font-dm-sans">
      <AdminSidebar 
        activeTab={activeTab} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header / Toggle Bar */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 bg-tiko-surface border-b border-tiko-surface-container-high shadow-sm shrink-0">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Tiko Logo" className="w-8 h-8 object-contain rounded-full border border-tiko-outline-variant bg-white" />
            <span className="text-lg font-outfit font-bold text-tiko-primary tracking-tight">Tiko Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -mr-2 rounded-lg text-tiko-on-surface-variant hover:bg-tiko-surface-container-high transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
            <Outlet />
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
};
