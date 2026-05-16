import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import imagerySection from '../assets/Imagery Section (Left Side for Desktop).webp';

import { loginSchema, type LoginFormValues } from '../utils/validation';

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log('Login attempt:', data);
    toast.success('Static login successful (Demo)');
  };

  return (
    <div className="h-screen flex bg-tiko-surface font-dm-sans text-tiko-on-surface overflow-hidden">
      {/* Left Side: Imagery Section — hidden on mobile/tablet */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={imagerySection}
          alt="Luxury Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20" style={{ color: '#FFFBFF' }}>
          <h1 className="text-display-lg font-outfit leading-tight mb-4 drop-shadow-lg text-4xl sm:text-5xl lg:text-6xl">
            Welcome back to<br />Tiko
          </h1>
          <p className="text-body-lg max-w-md drop-shadow-md text-base sm:text-lg">
            Experience the curated warmth of our local boutique collective, now available at your fingertips.
          </p>
        </div>
      </div>

      {/* Right Side: Form Section — full width on mobile, half on desktop */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 2xl:p-24 bg-tiko-surface overflow-y-auto">
        <div className="flex justify-between items-center mb-12 lg:mb-0">
          <div className="flex items-center gap-2">
             <span className="text-tiko-primary">
                {/* Speaker Icon as seen in image */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
             </span>
             <span className="text-2xl font-outfit font-bold text-tiko-primary tracking-tight">Tiko</span>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8 py-8 lg:py-0">
          <div className="space-y-2">
            <h2 className="text-display-lg font-outfit font-bold text-4xl lg:text-5xl">Sign In</h2>
            <p className="text-body-md text-tiko-on-surface-variant">
              Enter your details to access your account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">Email or Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tiko-on-surface-variant">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    {...register('email')}
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                    placeholder="hello@tiko.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-tiko-error">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold font-outfit text-tiko-on-surface">Password</label>
                  <Link to="#" className="text-xs font-bold text-tiko-primary hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tiko-on-surface-variant">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                    placeholder="••••••••"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-tiko-on-surface-variant hover:text-tiko-on-surface transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-tiko-error">{errors.password.message}</p>}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    id="remember"
                    className="w-5 h-5 rounded-full border-tiko-outline-variant text-tiko-primary focus:ring-tiko-primary/20 cursor-pointer appearance-none checked:bg-tiko-primary border transition-all"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-tiko-on-surface-variant cursor-pointer">Remember Me</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-tiko-primary text-white rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-tiko-primary/20"
            >
              Login
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            
          </form>

          <p className="text-center text-tiko-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-tiko-primary hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>

        <footer className="mt-12 flex flex-col sm:flex-row justify-between items-center text-[10px] font-outfit font-bold text-tiko-on-surface-variant gap-4 uppercase tracking-widest">
          <div className="flex gap-6">
            <Link to="#" className="hover:text-tiko-on-surface transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-tiko-on-surface transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-tiko-on-surface transition-colors">Help Center</Link>
          </div>
          <p>© 2024 Tiko. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;

