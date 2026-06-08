import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import { orderService, paymentMethodService, deliveryService } from "../services";
import { useAuth } from "../hooks/useAuth";
import type { CreateOrderRequest, DeliveryZone } from "../types";

// ─── Validation schema ────────────────────────────────────────────────────────
const deliverySchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    phone: z.string().min(8, "Phone number is required"),
    streetAddress: z.string().min(5, "Street address is required"),
    paymentMethod: z.enum(["CASH", "INSTAPAY"] as const, {
      message: "Select a payment method",
    }),
    instapayReference: z.string().optional(),
    instapaySenderEmail: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address"
    }),
    instapaySenderPhone: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "INSTAPAY") {
        const hasEmail = !!data.instapaySenderEmail?.trim();
        const hasPhone = !!data.instapaySenderPhone?.trim();
        return hasEmail || hasPhone;
      }
      return true;
    },
    {
      message: "At least one of Instapay sender email or phone is required",
      path: ["instapaySenderEmail"],
    }
  );

type DeliveryFormData = z.infer<typeof deliverySchema>;

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Delivery & Payment", "Review & Place"];

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-10">
    {STEPS.map((label, i) => {
      const step = i + 1;
      const done = current > step;
      const active = current === step;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-outfit font-bold border-2 transition-all
                ${
                  done
                    ? "bg-tiko-primary border-tiko-primary text-white"
                    : active
                      ? "bg-tiko-primary border-tiko-primary text-white shadow-md shadow-tiko-primary/25"
                      : "bg-white border-tiko-outline-variant text-tiko-on-surface-variant"
                }`}>
              {done ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span
              className={`mt-1.5 text-xs font-outfit font-bold ${active ? "text-tiko-primary" : "text-tiko-on-surface-variant"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-[2px] w-16 sm:w-24 mx-1 mb-5 rounded-full transition-all ${done ? "bg-tiko-primary" : "bg-tiko-outline-variant"}`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Order Summary sidebar ────────────────────────────────────────────────────
interface OrderSummaryProps {
  deliveryFee: number | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ deliveryFee }) => {
  const { items, subtotal } = useCart();
  const taxes = 0;
  const subtotalEGP = subtotal / 100;
  const total = subtotalEGP + (deliveryFee ?? 0);

  return (
    <div className="bg-tiko-surface-container-low rounded-2xl p-6 space-y-5 sticky top-24">
      <h3 className="font-outfit font-bold text-lg text-tiko-on-surface">
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-tiko-surface-container">
              <img
                src={item.image || undefined}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-outfit font-bold text-tiko-on-surface leading-snug">
                {item.name}
              </p>
              <p className="text-xs text-tiko-on-surface-variant">
                Qty: {item.qty}
              </p>
              <p className="text-sm font-bold text-tiko-primary">
                {(item.price / 100).toFixed(2)} EGP
              </p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-tiko-outline-variant" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-tiko-on-surface-variant">
          <span>Subtotal</span>
          <span className="font-dm-sans">
            {subtotalEGP.toFixed(2)} EGP
          </span>
        </div>
        <div className="flex justify-between text-tiko-on-surface-variant">
          <span>Delivery Fee</span>
          {deliveryFee !== null ? (
            <span className="font-dm-sans">{deliveryFee.toFixed(2)} EGP</span>
          ) : (
            <span className="font-dm-sans text-tiko-outline italic">Select a zone</span>
          )}
        </div>
        <div className="flex justify-between text-tiko-on-surface-variant">
          <span>Taxes</span>
          <span className="font-dm-sans">{taxes.toFixed(2)} EGP</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-tiko-on-surface text-base pt-2 border-t border-tiko-outline-variant">
        <span className="font-outfit">Total Amount</span>
        {deliveryFee !== null ? (
          <span className="text-tiko-primary font-outfit">
            {total.toFixed(2)} EGP
          </span>
        ) : (
          <span className="text-tiko-outline font-outfit italic text-sm">—</span>
        )}
      </div>

      {/* Security badge */}
      <div className="flex items-start gap-2 bg-tiko-surface-container rounded-xl p-3">
        <svg
          className="text-tiko-tertiary shrink-0 mt-0.5"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-xs text-tiko-on-surface-variant leading-snug">
          Secure checkout with Tiko's buyer protection guarantee.
        </p>
      </div>
    </div>
  );
};

// Helper to generate a unique guest email if the user is not authenticated
const getOrCreateGuestEmail = (): string => {
  let guestEmail = localStorage.getItem("tiko_guest_email");
  if (!guestEmail) {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    guestEmail = `guest_${uuid}@guest.local`;
    localStorage.setItem("tiko_guest_email", guestEmail);
  }
  return guestEmail;
};

// ─── Main page ────────────────────────────────────────────────────────────────
const CheckoutPage: React.FC = () => {
  const [step] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeItem } = useCart();

  // Fetch enabled payment methods
  const { data: paymentMethods = [], isLoading: isPaymentMethodsLoading } = useQuery({
    queryKey: ["payment-methods", "enabled"],
    queryFn: () => paymentMethodService.getEnabled(),
  });

  // Fetch active delivery zones
  const { data: deliveryZones = [], isLoading: isZonesLoading } = useQuery({
    queryKey: ["delivery-zones"],
    queryFn: () => deliveryService.list(),
    staleTime: 1000 * 60 * 5,
  });

  // Auto-select first zone if only one exists
  useEffect(() => {
    if (deliveryZones.length === 1 && !selectedZone) {
      setSelectedZone(deliveryZones[0]);
    }
  }, [deliveryZones, selectedZone]);

  const isCashEnabled = paymentMethods.some((m) => m.id === "CASH" && m.isEnabled);
  const isInstapayEnabled = paymentMethods.some((m) => m.id === "INSTAPAY" && m.isEnabled);
  const instapayConfig = paymentMethods.find((m) => m.id === "INSTAPAY")?.config;

  // Transaction image state (InstaPay)
  const [transactionFile, setTransactionFile] = useState<File | null>(null);
  const [transactionPreview, setTransactionPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setTransactionFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setTransactionPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setTransactionPreview(null);
    }
  };

  const handleDropZoneClick = () => fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file && (file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(file.name))) {
      setTransactionFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setTransactionPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      paymentMethod: "CASH",
      instapayReference: "",
      instapaySenderEmail: "",
      instapaySenderPhone: "",
    },
  });

  const selectedPayment = watch("paymentMethod");

  // Keep paymentMethod selection valid if settings change
  useEffect(() => {
    if (paymentMethods.length > 0) {
      const activeMethods = paymentMethods.filter(m => m.isEnabled);
      if (activeMethods.length > 0) {
        const isCurrentActive = activeMethods.some(m => m.id === selectedPayment);
        if (!isCurrentActive) {
          setValue("paymentMethod", activeMethods[0].id as "CASH" | "INSTAPAY");
        }
      }
    }
  }, [paymentMethods, selectedPayment, setValue]);

  const onSubmit = async (data: DeliveryFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Require a delivery zone only when zones are available
    if (deliveryZones.length > 0 && !selectedZone) {
      toast.error("Please select a delivery zone.");
      return;
    }

    if (data.paymentMethod === "INSTAPAY" && !transactionFile) {
      toast.error("Please upload your transaction screenshot to confirm payment.");
      return;
    }

    setIsSubmitting(true);
    try {
      let instapayScreenshotUrl: string | undefined;

      // Upload transaction screenshot first
      if (data.paymentMethod === "INSTAPAY" && transactionFile) {
        try {
          const uploadRes = await orderService.uploadTempTransactionImage(transactionFile);
          instapayScreenshotUrl = uploadRes.transactionImageUrl;
        } catch {
          toast.error("Failed to upload payment screenshot. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      const payload: CreateOrderRequest = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.qty,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
        shippingFullName: data.fullName,
        shippingPhone: data.phone,
        shippingStreet: data.streetAddress,
        deliveryZoneCode: selectedZone?.code,
        paymentMethod: data.paymentMethod,
        instapayReference: data.paymentMethod === "INSTAPAY" ? data.instapayReference : undefined,
        instapaySenderEmail: data.paymentMethod === "INSTAPAY" ? data.instapaySenderEmail : undefined,
        instapaySenderPhone: data.paymentMethod === "INSTAPAY" ? data.instapaySenderPhone : undefined,
        instapayScreenshotUrl: instapayScreenshotUrl,
        guestEmail: user?.email || getOrCreateGuestEmail(),
      };

      const orderResult = await orderService.create(payload);

      toast.success(`Order #${orderResult.orderNumber} placed successfully!`);

      // Clear the cart on success
      items.forEach((item) => {
        removeItem(item.id);
      });

      // Redirect back to main page
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      let message = "Failed to place order. Please try again.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
      ) {
        message = err.response.data.message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-tiko-surface font-dm-sans text-tiko-on-surface">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page title */}
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-tiko-on-surface text-center mb-10">
          Checkout
        </h1>

        {/* Step indicator */}
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Delivery Details card */}
              <div className="bg-white border border-tiko-outline-variant rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-tiko-outline-variant">
                  <svg
                    className="text-tiko-primary"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <h2 className="font-outfit font-bold text-xl text-tiko-on-surface">
                    Delivery Details
                  </h2>
                </div>

                {/* Full Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      {...register("fullName")}
                      id="fullName"
                      type="text"
                      placeholder="Zaid Al-Mansour"
                      className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-tiko-error">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      id="phone"
                      type="tel"
                      placeholder="+962 7X XXX XXXX"
                      className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-tiko-error">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label
                    htmlFor="streetAddress"
                    className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                    Street Address
                  </label>
                  <input
                    {...register("streetAddress")}
                    id="streetAddress"
                    type="text"
                    placeholder="Rainbow St. Building 42, Apt 4"
                    className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                  />
                  {errors.streetAddress && (
                    <p className="mt-1 text-xs text-tiko-error">
                      {errors.streetAddress.message}
                    </p>
                  )}
                </div>

                {/* Delivery Zone */}
                {!isZonesLoading && deliveryZones.length > 0 && (
                  <div>
                    <label
                      htmlFor="deliveryZone"
                      className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                      Delivery Zone
                      <span className="ml-1 text-tiko-error font-bold">*</span>
                    </label>
                    <select
                      id="deliveryZone"
                      value={selectedZone?.code ?? ''}
                      onChange={(e) => {
                        const zone = deliveryZones.find((z) => z.code === e.target.value) ?? null;
                        setSelectedZone(zone);
                      }}
                      className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all bg-white text-tiko-on-surface"
                    >
                      <option value="" disabled>Select your governorate / area…</option>
                      {deliveryZones.map((zone) => (
                        <option key={zone.code} value={zone.code}>
                          {zone.name} — {zone.fee.toFixed(2)} EGP
                        </option>
                      ))}
                    </select>
                    {deliveryZones.length > 0 && !selectedZone && (
                      <p className="mt-1 text-xs text-tiko-error">Please select a delivery zone</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method card */}
              <div className="bg-white border border-tiko-outline-variant rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-tiko-outline-variant">
                  <div className="flex items-center gap-2">
                    <svg
                      className="text-tiko-primary"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <h2 className="font-outfit font-bold text-xl text-tiko-on-surface">
                      Payment Method
                    </h2>
                  </div>
                </div>

                {isPaymentMethodsLoading ? (
                  <div className="flex items-center justify-center p-6 text-sm text-tiko-on-surface-variant">
                    <svg className="animate-spin h-5 w-5 text-tiko-primary mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading payment methods...
                  </div>
                ) : !isCashEnabled && !isInstapayEnabled ? (
                  <div className="text-center p-6 border border-dashed border-tiko-outline-variant rounded-xl text-tiko-error">
                    No payment methods are currently available. Please contact support.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Cash on Delivery */}
                      {isCashEnabled && (
                        <button
                          type="button"
                          onClick={() => setValue("paymentMethod", "CASH")}
                          className={`flex items-center gap-3 px-5 py-4.5 rounded-xl border-2 transition-all text-left
                            ${
                              selectedPayment === "CASH"
                                ? "border-tiko-primary bg-tiko-primary/5"
                                : "border-tiko-outline-variant hover:border-tiko-primary/50"
                            }`}>
                          <svg
                            className={selectedPayment === "CASH" ? "text-tiko-primary" : "text-tiko-outline"}
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                          </svg>
                          <div>
                            <p className={`text-sm font-outfit font-bold ${selectedPayment === "CASH" ? "text-tiko-primary" : "text-tiko-on-surface"}`}>
                              Cash on Delivery
                            </p>
                            <p className="text-xs text-tiko-on-surface-variant mt-0.5">
                              Pay at your doorstep
                            </p>
                          </div>
                        </button>
                      )}

                      {/* InstaPay */}
                      {isInstapayEnabled && (
                        <button
                          type="button"
                          onClick={() => setValue("paymentMethod", "INSTAPAY")}
                          className={`flex items-center gap-3 px-5 py-4.5 rounded-xl border-2 transition-all text-left
                            ${
                              selectedPayment === "INSTAPAY"
                                ? "border-tiko-primary bg-tiko-primary/5"
                                : "border-tiko-outline-variant hover:border-tiko-primary/50"
                            }`}>
                          <svg
                            className={selectedPayment === "INSTAPAY" ? "text-tiko-primary" : "text-tiko-outline"}
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                          <div>
                            <p className={`text-sm font-outfit font-bold ${selectedPayment === "INSTAPAY" ? "text-tiko-primary" : "text-tiko-on-surface"}`}>
                              InstaPay Transfer
                            </p>
                            <p className="text-xs text-tiko-on-surface-variant mt-0.5">
                              Pay instantly via app
                            </p>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* InstaPay Information View */}
                    {selectedPayment === "INSTAPAY" && isInstapayEnabled && (
                      <div className="bg-tiko-surface-container-low border border-tiko-outline-variant rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
                        <p className="text-xs font-bold text-tiko-outline uppercase tracking-wider">
                          InstaPay Transfer Instructions
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-5 items-center justify-between">
                          <div className="space-y-2.5 text-sm flex-1 w-full">
                            {instapayConfig?.email && (
                              <div className="flex justify-between border-b border-tiko-outline-variant pb-1.5">
                                <span className="text-tiko-on-surface-variant">InstaPay Address (IPA)</span>
                                <span className="font-bold text-tiko-on-surface">{instapayConfig.email}</span>
                              </div>
                            )}
                            {instapayConfig?.phone && (
                              <div className="flex justify-between border-b border-tiko-outline-variant pb-1.5">
                                <span className="text-tiko-on-surface-variant">Phone Number</span>
                                <span className="font-bold text-tiko-on-surface">{instapayConfig.phone}</span>
                              </div>
                            )}
                            {instapayConfig?.paymentLink && (
                              <div className="pt-2">
                                <a
                                  href={instapayConfig.paymentLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#5e2b83] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
                                  Open Payment Link
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                  </svg>
                                </a>
                              </div>
                            )}
                          </div>
                          
                          {instapayConfig?.qrCodeUrl && (
                            <div className="shrink-0 text-center space-y-1">
                              <img
                                src={instapayConfig.qrCodeUrl}
                                alt="Instapay Scan QR Code"
                                className="w-32 h-32 border border-tiko-outline-variant rounded-xl p-1 bg-white shadow-sm object-contain"
                              />
                              <span className="text-[10px] text-tiko-on-surface-variant uppercase tracking-wider block font-bold">
                                Scan to Pay
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 space-y-4">
                          {/* Reference / sender name */}
                          <div>
                            <label
                              htmlFor="instapayReference"
                              className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                              Instapay Reference Number
                              <span className="ml-1 text-tiko-outline font-normal normal-case">(optional)</span>
                            </label>
                            <input
                              {...register("instapayReference")}
                              id="instapayReference"
                              type="text"
                              placeholder="Enter transfer reference code (if available)"
                              className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                            />
                            {errors.instapayReference && (
                              <p className="mt-1 text-xs text-tiko-error">
                                {errors.instapayReference.message}
                              </p>
                            )}
                          </div>

                          {/* Sender details: Email / Phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="instapaySenderEmail"
                                className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                                Sender Instapay Email / IPA
                              </label>
                              <input
                                {...register("instapaySenderEmail")}
                                id="instapaySenderEmail"
                                type="text"
                                placeholder="username@instapay"
                                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                              />
                              {errors.instapaySenderEmail && (
                                <p className="mt-1 text-xs text-tiko-error">
                                  {errors.instapaySenderEmail.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="instapaySenderPhone"
                                className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                                Sender Instapay Phone Number
                              </label>
                              <input
                                {...register("instapaySenderPhone")}
                                id="instapaySenderPhone"
                                type="tel"
                                placeholder="01XXXXXXXXX"
                                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                              />
                              {errors.instapaySenderPhone && (
                                <p className="mt-1 text-xs text-tiko-error">
                                  {errors.instapaySenderPhone.message}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Transaction screenshot upload */}
                          <div>
                            <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                              Transaction Screenshot
                              <span className="ml-1 text-tiko-error font-bold">*</span>
                            </label>

                            {/* Hidden file input */}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />

                            {transactionPreview ? (
                              /* Preview */
                              <div className="relative w-full rounded-xl overflow-hidden border border-tiko-primary/30 shadow-sm">
                                <img
                                  src={transactionPreview}
                                  alt="Transaction screenshot preview"
                                  className="w-full max-h-52 object-contain bg-tiko-surface-container"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <button
                                    type="button"
                                    onClick={handleDropZoneClick}
                                    className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-tiko-on-surface shadow hover:bg-white transition-all">
                                    Change
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setTransactionFile(null); setTransactionPreview(null); }}
                                    className="px-3 py-1.5 bg-tiko-error/90 backdrop-blur-sm rounded-lg text-xs font-bold text-white shadow hover:bg-tiko-error transition-all">
                                    Remove
                                  </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-3 py-2">
                                  <p className="text-[10px] text-white font-bold truncate">{transactionFile?.name}</p>
                                </div>
                              </div>
                            ) : (
                              /* Drop zone */
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={handleDropZoneClick}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onKeyDown={(e) => e.key === "Enter" && handleDropZoneClick()}
                                className="w-full border-2 border-dashed border-tiko-outline-variant rounded-xl p-6 text-center cursor-pointer hover:border-tiko-primary/50 hover:bg-tiko-primary/3 transition-all group">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-10 h-10 rounded-full bg-tiko-surface-container flex items-center justify-center group-hover:bg-tiko-primary/10 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-tiko-outline group-hover:text-tiko-primary transition-colors">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                      <circle cx="8.5" cy="8.5" r="1.5"/>
                                      <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                  </div>
                                  <p className="text-sm font-outfit font-bold text-tiko-on-surface-variant group-hover:text-tiko-primary transition-colors">
                                    Upload payment screenshot
                                  </p>
                                  <p className="text-xs text-tiko-outline">
                                    Drag &amp; drop or click to choose · JPG, PNG up to 10MB
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {errors.paymentMethod && (
                  <p className="text-xs text-tiko-error">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Bottom actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-sm text-tiko-on-surface-variant hover:text-tiko-primary transition-colors font-outfit font-bold">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Shopping
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-tiko-primary text-white font-outfit font-bold text-sm rounded-xl hover:bg-tiko-primary/90 active:scale-[0.98] transition-all shadow-md shadow-tiko-primary/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      PLACING ORDER...
                    </>
                  ) : (
                    <>
                      Place Order
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-1">
            <OrderSummary deliveryFee={selectedZone?.fee ?? (deliveryZones.length === 0 ? 3.5 : null)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
