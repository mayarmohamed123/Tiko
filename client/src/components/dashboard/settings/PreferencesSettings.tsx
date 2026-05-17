import React, { useState } from 'react';
import { Bell, DollarSign, Globe } from 'lucide-react';

interface PreferencesSettingsProps {
  onSavePreferences: (prefData: { currency: string; notifications: boolean; lang: string }) => void;
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({
  onSavePreferences,
}) => {
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);
  const [lang, setLang] = useState('en');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences({ currency, notifications, lang });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-tiko-md border border-tiko-surface-container-high p-6 shadow-sm font-dm-sans space-y-6">
      <div>
        <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">Store Preferences</h3>
        <p className="text-sm text-tiko-on-surface-variant">Adjust your regional parameters, notification metrics, and default locale.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            Preferences have been saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Regional Currency */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-tiko-primary" />
              <span>Base Store Currency</span>
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary transition-all bg-white text-tiko-on-surface cursor-pointer font-medium"
            >
              <option value="USD">USD ($) - United States Dollar</option>
              <option value="EGP">EGP (ج.م) - Egyptian Pound</option>
              <option value="EUR">EUR (€) - Euro</option>
            </select>
          </div>

          {/* Localization */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-tiko-primary" />
              <span>Manager Default Language</span>
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary transition-all bg-white text-tiko-on-surface cursor-pointer font-medium"
            >
              <option value="en">English (US)</option>
              <option value="ar">Arabic (العربية)</option>
            </select>
          </div>

          {/* Notifications Toggle */}
          <div className="sm:col-span-2 space-y-4">
            <label className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-tiko-primary" />
              <span>Real-Time Notifications</span>
            </label>
            
            <div className="flex items-center justify-between p-4 bg-tiko-surface rounded-xl border border-tiko-surface-container-high">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-tiko-on-surface">Order & Stock Notifications</p>
                <p className="text-xs text-tiko-on-surface-variant max-w-md">
                  Receive instant toast and sound alerts when customers checkout orders or when a product hits critical low stock levels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications ? 'bg-tiko-primary' : 'bg-tiko-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-tiko-primary hover:bg-tiko-primary-container text-white px-5 py-3 rounded-full text-sm font-bold shadow-md shadow-tiko-primary/15 transition-all active:scale-[0.98]"
          >
            Save preferences
          </button>
        </div>
      </form>
    </div>
  );
};
