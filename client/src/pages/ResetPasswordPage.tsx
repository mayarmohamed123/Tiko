import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import imagerySection from "../assets/Imagery Section (Left Side for Desktop).png";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../utils/validation";
import { authService } from "../services";
import { getErrorMessage } from "../utils/getErrorMessage";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Reset token is missing. Please check your email link.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to reset password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex bg-tiko-surface font-dm-sans text-tiko-on-surface overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={imagerySection}
          alt="Luxury Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20"
          style={{ color: "#FFFFFF" }}>
          <p className="text-display-lg font-outfit leading-tight mb-4 drop-shadow-lg text-4xl sm:text-5xl lg:text-6xl">
            Choose a New
            <br />
            Password
          </p>
          <p className="text-body-lg max-w-md drop-shadow-md text-base sm:text-lg">
            Ensure your account is secure by setting a strong password.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 bg-tiko-surface overflow-y-auto">
        <div className="flex justify-between items-center mb-12 lg:mb-0">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Tiko Logo" className="w-10 h-10 object-contain rounded-full border border-tiko-outline-variant bg-white" />
            <span className="text-2xl font-outfit font-bold text-tiko-primary tracking-tight">
              Tiko
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8 py-8 lg:py-0">
          <div className="space-y-2">
            <h2 className="text-display-lg font-outfit font-bold text-4xl lg:text-5xl">
              Reset Password
            </h2>
            <p className="text-tiko-on-surface-variant text-base">
              Enter your new password below.
            </p>
          </div>

          {!token ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="bg-red-50 text-tiko-error p-4 rounded-full">
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-outfit text-tiko-error">Invalid Reset Link</h3>
                <p className="text-tiko-on-surface-variant text-base">
                  The password reset token is missing from the URL. Please request a new password reset link.
                </p>
              </div>
              <Link
                to="/forgot-password"
                className="block w-full py-4 bg-tiko-primary text-white text-center rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 transition-all">
                Forgot Password
              </Link>
            </div>
          ) : success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full">
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-outfit">Password Updated!</h3>
                <p className="text-tiko-on-surface-variant text-base">
                  Your password has been successfully updated. You can now use it to sign in.
                </p>
              </div>
              <Link
                to="/login"
                className="block w-full py-4 bg-tiko-primary text-white text-center rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 transition-all">
                Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold font-outfit text-tiko-on-surface">
                    New Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    className="w-full px-4 py-3.5 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-xs text-tiko-error">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold font-outfit text-tiko-on-surface">
                    Confirm New Password
                  </label>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    className="w-full px-4 py-3.5 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-tiko-error">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-tiko-primary text-white rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 disabled:opacity-60 transition-all">
                {submitting ? "Resetting password…" : "Reset Password"}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-tiko-on-surface-variant">
              Back to{" "}
              <Link
                to="/login"
                className="font-bold text-tiko-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>

        <div className="text-center text-xs text-tiko-on-surface-variant py-4">
          &copy; {new Date().getFullYear()} Tiko. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
