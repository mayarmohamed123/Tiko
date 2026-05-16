import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import interiorDesign from '../assets/Interior Design.webp';

import { registerSchema, type RegisterFormValues } from '../utils/validation';

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log('Registration data:', data);
    toast.success('Static registration successful (Demo)');
  };

  return (
    <div className="h-screen flex bg-tiko-surface font-dm-sans text-tiko-on-surface overflow-hidden">

      {/* Left Side: Branding & Image — hidden on mobile/tablet, visible on lg+ */}
      <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center gap-6 p-10 bg-tiko-surface-container-low border-r border-tiko-outline-variant">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="text-tiko-primary">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            </span>
            <span className="text-4xl font-outfit font-bold text-tiko-primary tracking-tight">Tiko</span>
          </div>
          <p className="text-sm text-tiko-on-surface-variant max-w-xs">
            Quiet Luxury meets Neighborhood Warmth. Join our community for a curated shopping experience.
          </p>
        </div>

        {/* Image */}
        <div className="relative w-full max-w-sm group">
          <img
            src={interiorDesign}
            alt="Interior Design"
            className="w-full h-auto rounded-tiko-lg object-cover shadow-xl transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 rounded-tiko-lg ring-1 ring-inset ring-black/5"></div>
        </div>

        {/* Footer */}
        <p className="text-[9px] font-outfit font-bold text-tiko-on-surface-variant uppercase tracking-widest">
          © 2024 Tiko. All rights reserved.
        </p>
      </div>

      {/* Right Side: Form Section */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-tiko-surface overflow-y-auto">
        <div className="max-w-xl w-full mx-auto space-y-6">

          {/* On mobile: show minimal logo since left panel is hidden */}
          <div className="flex items-center gap-2 lg:hidden mb-4">
            <span className="text-tiko-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            </span>
            <span className="text-2xl font-outfit font-bold text-tiko-primary tracking-tight">Tiko</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-outfit font-bold text-tiko-on-surface">Create Account</h2>
            <p className="text-sm lg:text-base text-tiko-on-surface-variant">
              Fill in your details to get started with{' '}
              <span className="text-tiko-primary font-semibold">Tiko</span>.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Row 1: Full Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">Full Name</label>
                <input
                  {...register('fullName')}
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                  placeholder="E.g. Jane Doe"
                />
                {errors.fullName && <p className="text-xs text-tiko-error">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="text-xs text-tiko-error">{errors.email.message}</p>}
              </div>
            </div>

            {/* Row 2: Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold font-outfit text-tiko-on-surface">Phone Number</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                placeholder="+20 111 111 1111"
              />
              {errors.phone && <p className="text-xs text-tiko-error">{errors.phone.message}</p>}
            </div>

            {/* Row 3: Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                    placeholder="••••••••"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-tiko-on-surface-variant hover:text-tiko-on-surface transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-tiko-error">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">Confirm Password</label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                    placeholder="••••••••"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-tiko-on-surface-variant hover:text-tiko-on-surface transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-tiko-error">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Row 4: Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold font-outfit text-tiko-on-surface">Address/Delivery Location</label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all resize-none placeholder:text-tiko-outline-variant"
                placeholder="Enter your full street address, city, and zip code..."
              />
              {errors.address && <p className="text-xs text-tiko-error">{errors.address.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-tiko-primary text-white rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-tiko-primary/20 flex items-center justify-center gap-2 mt-2"
            >
              Create Account
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

          </form>

          <p className="text-center text-sm lg:text-base text-tiko-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-tiko-primary hover:underline">Log in</Link>
          </p>

          <div className="flex justify-center gap-8 text-[10px] font-outfit font-bold text-tiko-on-surface-variant border-t border-tiko-outline-variant pt-6 uppercase tracking-widest">
            <Link to="#" className="hover:text-tiko-on-surface transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-tiko-on-surface transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
