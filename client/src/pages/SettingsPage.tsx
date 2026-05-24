import React from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ProfileSettings } from '../components/dashboard/settings/ProfileSettings';
import { SecuritySettings } from '../components/dashboard/settings/SecuritySettings';
import { PreferencesSettings } from '../components/dashboard/settings/PreferencesSettings';
import { FeatureUnavailable } from '../components/common/FeatureUnavailable';
import { PageLoader } from '../components/common/PageLoader';
import { authService } from '../services';

import container from '../assets/Container.webp';

export const SettingsPage: React.FC = () => {
  const { data: me, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
  });

  const handleSaveProfile = () => {
    toast.error('PATCH /api/auth/profile — not implemented on backend yet');
  };

  const handleSavePassword = () => {
    toast.error('POST /api/auth/change-password — not implemented (use forgot-password flow)');
  };

  const handleSavePreferences = () => {
    toast.error('PATCH /api/store/settings — not implemented on backend yet');
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8 font-dm-sans max-w-4xl animate-fade-in pb-12">
      <header className="mb-4">
        <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Account & Preferences</h2>
        <p className="text-tiko-on-surface-variant text-sm">
          Profile loaded from GET /api/auth/me. Other sections pending backend APIs.
        </p>
      </header>

      <div className="space-y-8">
        <ProfileSettings
          initialName={me?.fullName ?? 'Admin'}
          initialEmail={me?.email ?? ''}
          initialPhoto={container}
          onSave={handleSaveProfile}
        />

        <FeatureUnavailable description="Update profile (name, photo) requires PATCH /api/auth/profile." />

        <SecuritySettings onSavePassword={handleSavePassword} />
        <FeatureUnavailable description="Change password while logged in requires POST /api/auth/change-password." />

        <PreferencesSettings onSavePreferences={handleSavePreferences} />
        <FeatureUnavailable description="Store currency/locale requires GET/PATCH /api/store/settings (StoreSettings model exists, no route yet)." />
      </div>
    </div>
  );
};

export default SettingsPage;
