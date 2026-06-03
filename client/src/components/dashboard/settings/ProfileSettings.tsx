import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

// Default visual placeholder
import container from '../../../assets/Container.webp';

interface ProfileSettingsProps {
  initialName: string;
  initialEmail: string;
  initialPhoto: string;
  onSave: (data: { name: string; email: string }, avatarFile: File | null) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  initialName,
  initialEmail,
  initialPhoto,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [photo, setPhoto] = useState<string | null>(initialPhoto || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ name, email }, avatarFile);
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
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 p-2 bg-tiko-primary hover:bg-tiko-primary-container text-white rounded-full shadow-lg transition-all"
              title="Upload custom photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-tiko-on-surface">Avatar Graphic</h4>
            <p className="text-xs text-tiko-on-surface-variant max-w-sm">
              Upload a custom image to personalize your store manager account photo.
            </p>
          </div>
        </div>

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
