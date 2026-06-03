import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import imagerySection from "../assets/Imagery Section (Left Side for Desktop).webp";
import { loginSchema, type LoginFormValues } from "../utils/validation";
import { authService } from "../services";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

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
      const res = await authService.login({
        email: data.email,
        password: data.password,
      });
      setUser(res.user);
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
          style={{ color: "#FFFBFF" }}>
          <h1 className="text-display-lg font-outfit leading-tight mb-4 drop-shadow-lg text-4xl sm:text-5xl lg:text-6xl">
            Welcome back to
            <br />
            Tiko
          </h1>
          <p className="text-body-lg max-w-md drop-shadow-md text-base sm:text-lg">
            Experience the curated warmth of our local boutique collective, now
            available at your fingertips.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 2xl:p-24 bg-tiko-surface overflow-y-auto">
        <div className="flex justify-between items-center mb-12 lg:mb-0">
          <div className="flex items-center gap-2">
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
          </div>
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
                <label className="text-sm font-bold font-outfit text-tiko-on-surface">
                  Password
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
