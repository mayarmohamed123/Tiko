import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import imagerySection from "../assets/Imagery Section (Left Side for Desktop).png";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../utils/validation";
import { authService } from "../services";
import { getErrorMessage } from "../utils/getErrorMessage";

const ForgotPasswordPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setSubmitting(true);
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
      toast.success("Password reset email sent!");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to send reset email"));
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
            Reset Your
            <br />
            Password
          </p>
          <p className="text-body-lg max-w-md drop-shadow-md text-base sm:text-lg">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 bg-tiko-surface overflow-y-auto">
        <div className="flex justify-between items-center mb-12 lg:mb-0">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-tiko-primary">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            </span>
            <span className="text-2xl font-outfit font-bold text-tiko-primary tracking-tight">
              Tiko
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8 py-8 lg:py-0">
          <div className="space-y-2">
            <h2 className="text-display-lg font-outfit font-bold text-4xl lg:text-5xl">
              Forgot Password
            </h2>
            <p className="text-tiko-on-surface-variant text-base">
              No worries, it happens. We'll send you a recovery link.
            </p>
          </div>

          {success ? (
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
                      d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-outfit">Check your inbox</h3>
                <p className="text-tiko-on-surface-variant text-base">
                  We've sent a password reset link to your email address. Please follow the instructions in the email.
                </p>
              </div>
              <Link
                to="/login"
                className="block w-full py-4 bg-tiko-primary text-white text-center rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 transition-all">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1.5">
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-3.5 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all"
                  placeholder="admin@tiko.com"
                />
                {errors.email && (
                  <p className="text-xs text-tiko-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-tiko-primary text-white rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 disabled:opacity-60 transition-all">
                {submitting ? "Sending email…" : "Send Reset Link"}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-tiko-on-surface-variant">
              Remembered your password?{" "}
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

export default ForgotPasswordPage;
