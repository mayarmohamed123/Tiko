import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import NewArrivalsSection from '../components/NewArrivalsSection';
import BestSellersSection from '../components/BestSellersSection';

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const sectionId = state.scrollTo;
      const timer = setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        // Clear state to prevent re-scrolling on back navigation/refresh
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <NewArrivalsSection />
      <BestSellersSection />
    </>
  );
};

export default HomePage;
