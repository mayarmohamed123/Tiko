import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-tiko-surface font-dm-sans text-tiko-on-surface flex flex-col relative">
      <Navbar />
      <CartDrawer />
      <main className="grow pt-16">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/201104826631"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="drop-shadow-md"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.13-1.346a9.921 9.921 0 004.882 1.28h.005c5.507 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065C17.195 3.038 14.685 2 12.012 2zm5.795 13.914c-.244.688-1.22 1.26-1.678 1.348-.396.074-.91.134-2.684-.6-2.27-.936-3.708-3.24-3.822-3.39-.115-.15-.934-1.24-.934-2.366 0-1.127.587-1.68.798-1.905.212-.225.46-.28.614-.28.154 0 .307.001.442.008.143.007.337-.054.528.406.195.47.668 1.628.726 1.745.058.118.097.254.019.41-.077.156-.156.254-.307.43-.153.176-.32.37-.457.51-.153.155-.313.324-.136.63.177.302.787 1.298 1.687 2.097.77.686 1.417.898 1.724 1.054.307.156.488.134.668-.073.18-.207.77-.895.975-1.201.205-.307.41-.256.69-.153.283.103 1.796.846 2.103.999.308.154.512.23.587.359.076.13.076.75-.168 1.438z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-sm font-bold font-outfit pl-0 group-hover:pl-2">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
