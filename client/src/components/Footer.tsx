import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder — will connect to backend later
    setEmail('');
  };

  return (
    <footer className="bg-tiko-surface border-t border-tiko-outline-variant font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Tiko Logo" className="w-8 h-8 object-contain rounded-full border border-tiko-outline-variant bg-white" />
              <span className="text-xl font-bold text-tiko-on-surface tracking-tight">Tiko</span>
            </div>
            <p className="text-sm text-tiko-on-surface-variant leading-relaxed max-w-xs">
              Bringing the warmth of the neighborhood and the luxury of curated design to your doorstep. From our heart to your home.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/tiko.egy?igsh=MTNraXdodzZsYm9ndQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-tiko-outline-variant flex items-center justify-center text-tiko-on-surface-variant hover:bg-tiko-primary hover:text-white hover:border-tiko-primary transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@tiko.egy1214?_r=1&_t=ZS-96sm57GwTrx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-tiko-outline-variant flex items-center justify-center text-tiko-on-surface-variant hover:bg-tiko-primary hover:text-white hover:border-tiko-primary transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold text-tiko-on-surface uppercase tracking-widest mb-5">Shop</h4>
            <ul className="space-y-3">
              {['All Products', 'Furniture', 'Textiles', 'Gift Cards'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-tiko-on-surface-variant hover:text-tiko-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-xs font-bold text-tiko-on-surface uppercase tracking-widest mb-5">Help</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-tiko-on-surface-variant hover:text-tiko-primary transition-colors">Delivery Info</Link></li>
              <li><Link to="/contact" className="text-sm text-tiko-on-surface-variant hover:text-tiko-primary transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-sm text-tiko-on-surface-variant hover:text-tiko-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm text-tiko-on-surface-variant hover:text-tiko-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-xs font-bold text-tiko-on-surface uppercase tracking-widest mb-5">Newsletter</h4>
            <p className="text-sm text-tiko-on-surface-variant leading-relaxed mb-5">
              Join our community for early access and styling tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 min-w-0 px-4 py-2.5 bg-white border border-tiko-outline-variant rounded-full text-sm placeholder:text-tiko-outline-variant focus:outline-none focus:border-tiko-primary transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-tiko-primary text-white font-bold text-sm rounded-full hover:bg-tiko-primary/90 active:scale-95 transition-all shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-tiko-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-tiko-on-surface-variant">© 2026 Tiko. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <Link key={item} to="#" className="text-xs text-tiko-on-surface-variant hover:text-tiko-primary transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
