import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Shop All', to: '/shop' },
    { label: 'New Arrivals', to: '/new-arrivals' },
    { label: 'Best Sellers', to: '/best-sellers' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const handleNavLinkClick = (e: React.MouseEvent, to: string) => {
    if (to === '/new-arrivals' || to === '/best-sellers') {
      e.preventDefault();
      const sectionId = to === '/new-arrivals' ? 'new-arrivals' : 'best-sellers';
      
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/', { state: { scrollTo: sectionId } });
      }
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-outfit ${
        scrolled ? 'bg-tiko-surface/95 backdrop-blur-md shadow-sm' : 'bg-tiko-surface'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="Tiko Logo" className="w-8 h-8 object-contain rounded-full border border-tiko-outline-variant bg-white" />
            <span className="text-xl font-bold text-tiko-on-surface tracking-tight">Tiko</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                onClick={(e) => handleNavLinkClick(e, to)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-tiko-primary ${
                    isActive
                      ? 'text-tiko-primary border-b-2 border-tiko-primary pb-0.5'
                      : 'text-tiko-on-surface-variant'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-white border border-tiko-outline-variant rounded-full px-4 py-2 w-40 lg:w-52">
              <svg className="text-tiko-outline shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-tiko-on-surface placeholder:text-tiko-outline-variant focus:outline-none w-full"
              />
            </div>

            {/* Account / Logout */}
            {user && user.role !== 'ADMIN' ? (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 text-tiko-on-surface-variant hover:text-tiko-primary transition-colors"
                aria-label="Sign out"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            ) : !user ? (
              <Link
                to="/login"
                className="p-2 text-tiko-on-surface-variant hover:text-tiko-primary transition-colors"
                aria-label="Account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            ) : null}

            {/* Cart button — opens sliding drawer */}
            <button
              id="cart-toggle-btn"
              onClick={toggleCart}
              className="relative p-2 text-tiko-on-surface-variant hover:text-tiko-primary transition-colors"
              aria-label="Open shopping bag"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-tiko-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-tiko-on-surface-variant hover:text-tiko-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-tiko-outline-variant py-4 space-y-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                onClick={(e) => {
                  handleNavLinkClick(e, to);
                  if (to !== '/new-arrivals' && to !== '/best-sellers') {
                    setMenuOpen(false);
                  }
                }}
                className="block px-2 py-3 text-sm font-medium text-tiko-on-surface-variant hover:text-tiko-primary transition-colors"
              >
                {label}
              </NavLink>
            ))}
            <div className="flex items-center gap-2 bg-white border border-tiko-outline-variant rounded-full px-4 py-2 mt-3">
              <svg className="text-tiko-outline shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search..." className="bg-transparent text-sm placeholder:text-tiko-outline-variant focus:outline-none w-full" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
