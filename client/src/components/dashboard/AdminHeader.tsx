import React from 'react';
import { Calendar, Download } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Dashboard Overview</h2>
        <p className="text-tiko-on-surface-variant text-sm">Welcome back, here's what's happening with your store today.</p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 bg-tiko-surface border border-tiko-outline-variant px-4 py-2 rounded-full text-sm font-medium text-tiko-on-surface hover:bg-tiko-surface-container">
          <Calendar className="w-4 h-4" />
          <span>Last 30 Days</span>
        </button>
        <button className="flex items-center space-x-2 bg-tiko-primary text-tiko-on-primary px-5 py-2 rounded-full text-sm font-medium hover:bg-tiko-primary-container transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
    </header>
  );
};
