import React from 'react';
import toast from 'react-hot-toast';
import { ProfileSettings } from '../components/dashboard/settings/ProfileSettings';
import { SecuritySettings } from '../components/dashboard/settings/SecuritySettings';
import { PreferencesSettings } from '../components/dashboard/settings/PreferencesSettings';

import container from '../assets/Container.webp';

export const SettingsPage: React.FC = () => {
  const handleSaveProfile = (data: { name: string; email: string; photo: string }) => {
    console.log('Saved profile details:', data);
    toast.success('Profile details updated successfully!');
  };

  const handleSavePassword = (data: { currentPass: string; newPass: string }) => {
    console.log('Password has been changed safely:', data);
    // Simulated backend call
    toast.success('Security password changed successfully!');
  };

  const handleSavePreferences = (data: { currency: string; notifications: boolean; lang: string }) => {
    console.log('Saved operating preferences:', data);
    toast.success('Preferences updated successfully!');
  };

  return (
    <div className="space-y-8 font-dm-sans max-w-4xl animate-fade-in pb-12">
      {/* Header */}
      <header className="mb-4">
        <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Account & Preferences</h2>
        <p className="text-tiko-on-surface-variant text-sm">Configure your personal admin session, credentials, and store configurations.</p>
      </header>

      {/* Sub-Components */}
      <div className="space-y-8">
        {/* Profile Settings Component */}
        <ProfileSettings
          initialName="Amman Design Manager"
          initialEmail="manager@tiko.com"
          initialPhoto={container}
          onSave={handleSaveProfile}
        />

        {/* Security / Password Component */}
        <SecuritySettings
          onSavePassword={handleSavePassword}
        />

        {/* Preferences / Store Settings Component */}
        <PreferencesSettings
          onSavePreferences={handleSavePreferences}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
