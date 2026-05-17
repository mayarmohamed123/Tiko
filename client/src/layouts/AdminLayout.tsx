import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/dashboard/AdminSidebar';
import { AdminFooter } from '../components/dashboard/AdminFooter';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
    <div className="min-h-screen bg-tiko-background text-tiko-on-surface flex font-dm-sans">
      <AdminSidebar activeTab={activeTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
          <AdminFooter />
        </div>
      </main>
    </div>
  );
};
