import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authService } from "../services";
import { getErrorMessage } from "../utils/getErrorMessage";
import imagerySection from "../assets/Imagery Section (Left Side for Desktop).png";

// Global cache to prevent duplicate verification requests in React StrictMode
const verificationCache = new Map<string, Promise<unknown>>();

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No verification token was provided. Please check your verification link."
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        let promise = verificationCache.get(token);
        if (!promise) {
          promise = authService.verifyEmail(token);
          verificationCache.set(token, promise);
        }
        await promise;
        setStatus("success");
      } catch (err: unknown) {
        // Remove from cache on error so user can retry in case of network glitch
        verificationCache.delete(token);
        setStatus("error");
        setErrorMessage(
          getErrorMessage(
            err,
            "The verification link is invalid or has expired. Please try registering again."
          )
        );
      }
    };

    verify();
  }, [token]);

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
            Complete Your
            <br />
            Registration
          </p>
          <p className="text-body-lg max-w-md drop-shadow-md text-base sm:text-lg">
            Experience the curated warmth of our local boutique collective, now
            available at your fingertips.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 bg-tiko-surface overflow-y-auto">
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
          {status === "loading" && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiko-primary"></div>
              </div>
              <h2 className="text-display-sm font-outfit font-bold text-3xl">
                Verifying your email
              </h2>
              <p className="text-tiko-on-surface-variant text-base">
                Please wait a moment while we verify your email address and activate your account.
              </p>
            </div>
          )}

          {status === "success" && (
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
                <h2 className="text-display-sm font-outfit font-bold text-3xl">
                  Account Verified!
                </h2>
                <p className="text-tiko-on-surface-variant text-base">
                  Your email has been successfully verified. You are ready to log in and start shopping.
                </p>
              </div>
              <Link
                to="/login"
                className="block w-full py-4 bg-tiko-primary text-white text-center rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 transition-all">
                Go to Sign In
              </Link>
            </div>
          )}

          {status === "error" && (
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
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-display-sm font-outfit font-bold text-3xl">
                  Verification Failed
                </h2>
                <p className="text-tiko-error text-base">
                  {errorMessage}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  to="/register"
                  className="block w-full py-4 bg-tiko-primary text-white text-center rounded-full font-outfit font-bold text-lg hover:bg-tiko-primary/90 transition-all">
                  Try Registering Again
                </Link>
                <Link
                  to="/login"
                  className="font-bold text-tiko-on-surface hover:underline text-center">
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-tiko-on-surface-variant py-4">
          &copy; {new Date().getFullYear()} Tiko. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
