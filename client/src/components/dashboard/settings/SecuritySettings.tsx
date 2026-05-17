import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SecuritySettingsProps {
  onSavePassword: (passwordData: { currentPass: string; newPass: string }) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onSavePassword,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPass || !newPass || !confirmPass) {
      setErrorMsg('All password fields are required.');
      return;
    }

    if (newPass.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    onSavePassword({ currentPass, newPass });
    setSuccessMsg('Your security password has been changed successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="bg-white rounded-tiko-md border border-tiko-surface-container-high p-6 shadow-sm font-dm-sans space-y-6">
      <div>
        <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">Security & Password</h3>
        <p className="text-sm text-tiko-on-surface-variant">Protect your management session by defining a strong password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-tiko-error text-sm px-4 py-3 rounded-xl">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Current Password */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all text-tiko-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tiko-outline hover:text-tiko-on-surface transition-colors"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all text-tiko-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tiko-outline hover:text-tiko-on-surface transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all text-tiko-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tiko-outline hover:text-tiko-on-surface transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-tiko-primary hover:bg-tiko-primary-container text-white px-5 py-3 rounded-full text-sm font-bold shadow-md shadow-tiko-primary/15 transition-all active:scale-[0.98]"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};
