import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import imagerySection from "../assets/Imagery Section (Left Side for Desktop).png";
import { loginSchema, type LoginFormValues } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);
    try {
      // Use context.login() so the token is stored in tokenStore for Safari.
      // Safari blocks cross-origin httpOnly cookies, so the token must be
      // sent as Authorization: Bearer on every request instead.
      const res = await login(data.email, data.password);
      toast.success("Signed in successfully");
      if (res.user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
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
            Welcome back to
            <br />
            Tiko
          </p>
          <p className="text-body-lg max-w-md drop-shadow-md text-base sm:text-lg">
            Experience the curated warmth of our local boutique collective, now
            available at your fingertips.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 2xl:p-24 bg-tiko-surface overflow-y-auto">
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
              Sign In
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">
                  Email
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

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold font-outfit text-tiko-on-surface">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-tiko-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 pr-12 py-3.5 bg-white border border-tiko-outline-variant rounded-tiko-md focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-tiko-on-surface-variant hover:text-tiko-on-surface transition-colors"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-tiko-error">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-tiko-primary text-white rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 disabled:opacity-60 transition-all">
              {submitting ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="text-center text-tiko-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-tiko-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
