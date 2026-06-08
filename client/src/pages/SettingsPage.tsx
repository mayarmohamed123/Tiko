import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ProfileSettings } from '../components/dashboard/settings/ProfileSettings';
import { SecuritySettings } from '../components/dashboard/settings/SecuritySettings';
import { PaymentMethodsSettings } from '../components/dashboard/settings/PaymentMethodsSettings';
import { DeliveryZonesSettings } from '../components/dashboard/settings/DeliveryZonesSettings';
import { PageLoader } from '../components/common/PageLoader';
import { authService } from '../services';
import { getErrorMessage } from '../utils/getErrorMessage';
import container from '../assets/Container.webp';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: me, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { fullName: string; email: string }) =>
      authService.updateProfile(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success(res.message || 'Profile updated successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update profile'));
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to upload profile photo'));
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPass: string; newPass: string }) =>
      authService.changePassword({
        currentPassword: data.currentPass,
        newPassword: data.newPass,
        confirmPassword: data.newPass,
      }),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to change password'));
    },
  });

  const handleSaveProfile = (
    data: { name: string; email: string },
    avatarFile: File | null
  ) => {
    updateProfileMutation.mutate({ fullName: data.name, email: data.email });
    if (avatarFile) {
      uploadAvatarMutation.mutate(avatarFile);
    }
  };

  const handleSavePassword = (data: { currentPass: string; newPass: string }) => {
    changePasswordMutation.mutate(data);
  };

  // Role is returned in the /auth/me response as part of the User object
  const isAdmin = me?.role === 'ADMIN';

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8 font-dm-sans max-w-4xl animate-fade-in pb-12">
      <header className="mb-4">
        <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Account &amp; Preferences</h2>
        <p className="text-tiko-on-surface-variant text-sm">
          Manage your profile identity and security settings.
        </p>
      </header>

      <div className="space-y-8">
        <ProfileSettings
          initialName={me?.fullName ?? 'Admin'}
          initialEmail={me?.email ?? ''}
          initialPhoto={me?.avatarUrl || container}
          onSave={handleSaveProfile}
        />

        <SecuritySettings onSavePassword={handleSavePassword} />

        {isAdmin && (
          <div className="space-y-3">
            <header>
              <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-0.5">Store Settings</h2>
              <p className="text-tiko-on-surface-variant text-sm">
                Configure payment methods, delivery zones, and store behaviour.
              </p>
            </header>
            <PaymentMethodsSettings />
            <DeliveryZonesSettings />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
