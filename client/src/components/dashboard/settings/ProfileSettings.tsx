import React, { useState } from 'react';
import { Camera, Check } from 'lucide-react';

// Define some cute premium avatar visuals
import container from '../../../assets/Container.webp';
import container1 from '../../../assets/Container1.webp';
import container2 from '../../../assets/Container2.webp';
import container3 from '../../../assets/Container3.webp';

interface ProfileSettingsProps {
  initialName: string;
  initialEmail: string;
  initialPhoto: string;
  onSave: (data: { name: string; email: string; photo: string }) => void;
}

const AVATAR_OPTIONS = [
  { name: 'Clay Peach', url: container },
  { name: 'Belgian Linen', url: container1 },
  { name: 'Sage Green', url: container2 },
  { name: 'Dark Terra', url: container3 },
];

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  initialName,
  initialEmail,
  initialPhoto,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [photo, setPhoto] = useState(initialPhoto);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ name, email, photo });
  };

  return (
    <div className="bg-white rounded-tiko-md border border-tiko-surface-container-high p-6 shadow-sm font-dm-sans space-y-6">
      <div>
        <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">Profile Information</h3>
        <p className="text-sm text-tiko-on-surface-variant">Update your public identity, email, and display avatar picture.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-tiko-primary bg-tiko-surface-container flex items-center justify-center shadow-md">
              <img src={photo || container} alt="Profile avatar" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute bottom-0 right-0 p-2 bg-tiko-primary hover:bg-tiko-primary-container text-white rounded-full shadow-lg transition-all"
              title="Choose photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-tiko-on-surface">Avatar Graphic</h4>
            <p className="text-xs text-tiko-on-surface-variant max-w-sm">
              Choose one of our premium minimalist ceramics/fabrics as your store manager avatar.
            </p>
          </div>
        </div>

        {/* Dynamic Avatar Picker grid */}
        {showAvatarPicker && (
          <div className="bg-tiko-surface-container-low border border-tiko-outline-variant p-4 rounded-xl space-y-3 animate-slide-down">
            <p className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Select Avatar Graphic:</p>
            <div className="flex gap-4">
              {AVATAR_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPhoto(opt.url);
                    setShowAvatarPicker(false);
                  }}
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 relative transition-all ${
                    photo === opt.url ? 'border-tiko-primary scale-105 shadow-md' : 'border-transparent hover:scale-105'
                  }`}
                >
                  <img src={opt.url} alt={opt.name} className="w-full h-full object-cover" />
                  {photo === opt.url && (
                    <div className="absolute inset-0 bg-tiko-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-tiko-primary bg-white rounded-full p-0.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all text-tiko-on-surface"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all text-tiko-on-surface"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-tiko-primary hover:bg-tiko-primary-container text-white px-5 py-3 rounded-full text-sm font-bold shadow-md shadow-tiko-primary/15 transition-all active:scale-[0.98]"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
