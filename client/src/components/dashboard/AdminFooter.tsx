import React from 'react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="mt-16 pt-8 border-t border-tiko-surface-container-high flex flex-col md:flex-row justify-between text-sm text-tiko-on-surface-variant">
      <div className="mb-8 md:mb-0 max-w-xs">
        <h4 className="text-lg font-outfit font-bold text-tiko-primary mb-4">Tiko</h4>
        <p>Empowering local artisans and neighborhood shops with premium digital management tools.</p>
      </div>
      
      <div className="flex flex-wrap gap-12">
        <div>
          <h5 className="font-bold text-tiko-on-surface uppercase tracking-wider mb-4 text-xs">Resources</h5>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-tiko-primary transition-colors">Delivery Information</a></li>
            <li><a href="#" className="hover:text-tiko-primary transition-colors">Returns</a></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold text-tiko-on-surface uppercase tracking-wider mb-4 text-xs">Company</h5>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-tiko-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-tiko-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="max-w-xs">
          <h5 className="font-bold text-tiko-on-surface uppercase tracking-wider mb-4 text-xs">Support</h5>
          <p className="mb-4">Need help? Visit our help center or contact our premium support team.</p>
          <p className="text-xs">&copy; 2024 Tiko. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
