import React from 'react';

const TrustBar: React.FC = () => {
  const items = [
    {
      label: 'Fast Local Delivery',
      sub: 'Same day in selected areas',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <path d="M16 8h4l3 5v3h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      label: 'Secure Visa Payment',
      sub: 'Encrypted transactions',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      label: 'Loved by Locals',
      sub: '4.9/5 stars community rating',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-tiko-surface-container-low border-y border-tiko-outline-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
          {items.map(({ label, sub, icon }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-tiko-on-surface-variant shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-outfit font-bold text-tiko-on-surface">{label}</p>
                <p className="text-xs text-tiko-on-surface-variant">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
