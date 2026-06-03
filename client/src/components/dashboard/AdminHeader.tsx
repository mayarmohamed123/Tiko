import React, { useState } from 'react';
import { Calendar, Download, LogOut, ChevronDown } from 'lucide-react';
import { authService } from '../../services';

export type DayRange = 7 | 30 | 90 | 0; // 0 = All Time

interface AdminHeaderProps {
  days: DayRange;
  onDaysChange: (days: DayRange) => void;
  onExport: () => void;
  isExporting?: boolean;
}

const DAY_OPTIONS: { label: string; value: DayRange }[] = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'All Time', value: 0 },
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  days,
  onDaysChange,
  onExport,
  isExporting = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedLabel = DAY_OPTIONS.find((o) => o.value === days)?.label ?? 'Last 30 Days';

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Dashboard Overview</h2>
        <p className="text-tiko-on-surface-variant text-sm">
          Welcome back, here's what's happening with your store today.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Date Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="flex items-center space-x-2 bg-tiko-surface border border-tiko-outline-variant px-4 py-2 rounded-full text-sm font-medium text-tiko-on-surface hover:bg-tiko-surface-container transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>{selectedLabel}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 z-50 bg-tiko-surface border border-tiko-outline-variant rounded-xl shadow-xl overflow-hidden min-w-36">
              {DAY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onDaysChange(opt.value);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-tiko-surface-container
                    ${days === opt.value ? 'text-tiko-primary font-bold bg-tiko-primary/5' : 'text-tiko-on-surface'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export CSV Button */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center space-x-2 bg-tiko-primary text-tiko-on-primary px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm disabled:opacity-60"
        >
          {isExporting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden md:inline">{isExporting ? 'Exporting…' : 'Export Report'}</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-tiko-error/10 text-tiko-error border border-tiko-error/20 px-4 py-2 rounded-full text-sm font-medium hover:bg-tiko-error/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Close dropdown on outside click */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </header>
  );
};
