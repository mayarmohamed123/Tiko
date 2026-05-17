import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-tiko-surface font-dm-sans text-tiko-on-surface flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
