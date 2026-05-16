import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-tiko-surface font-dm-sans text-tiko-on-surface flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
