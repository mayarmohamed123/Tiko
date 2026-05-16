import React from 'react';
import MainLayout from '../components/MainLayout';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import NewArrivalsSection from '../components/NewArrivalsSection';
import BestSellersSection from '../components/BestSellersSection';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <TrustBar />
      <NewArrivalsSection />
      <BestSellersSection />
    </MainLayout>
  );
};

export default HomePage;
