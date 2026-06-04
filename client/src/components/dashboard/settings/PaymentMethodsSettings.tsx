import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentMethodService } from '../../../services/paymentMethodService';
import type { InstapayConfig, PaymentMethodConfig } from '../../../services/paymentMethodService';
import { getErrorMessage } from '../../../utils/getErrorMessage';

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle: React.FC<{
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    disabled={disabled}
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-tiko-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
      ${enabled ? 'bg-tiko-primary' : 'bg-tiko-outline-variant'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
        ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-tiko-outline leading-snug">{hint}</p>}
  </div>
);

// ─── Instapay Config Panel ────────────────────────────────────────────────────
const InstapayConfigPanel: React.FC<{
  methodEnabled: boolean;
  initialConfig: InstapayConfig;
  onSave: (config: InstapayConfig) => void;
  isSaving: boolean;
}> = ({ methodEnabled, initialConfig, onSave, isSaving }) => {
  const [cfg, setCfg] = useState<InstapayConfig>({ ...initialConfig });
  const [qrPreview, setQrPreview] = useState<string | null>(initialConfig.qrCodeUrl ?? null);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadQrMutation = useMutation({
    mutationFn: (file: File) => paymentMethodService.uploadQrCode(file),
    onSuccess: (data) => {
      setCfg((prev) => ({ ...prev, qrCodeUrl: data.qrCodeUrl }));
      setQrPreview(data.qrCodeUrl);
      setQrFile(null);
      toast.success('QR code uploaded successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to upload QR code'));
    },
  });

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setQrFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setQrPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadQr = () => {
    if (qrFile) uploadQrMutation.mutate(qrFile);
  };

  const atLeastOne = !!(cfg.email?.trim() || cfg.phone?.trim() || cfg.paymentLink?.trim());
  const canSave = !methodEnabled || atLeastOne;

  return (
    <div className="mt-4 pt-4 border-t border-tiko-outline-variant space-y-5">
      <p className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">
        Instapay Configuration
      </p>

      {/* QR Code + fields row */}
      <div className="flex items-start gap-5">
        <div className="shrink-0">
          {qrPreview ? (
            <div className="relative group">
              <img
                src={qrPreview}
                alt="Instapay QR Code"
                className="w-28 h-28 rounded-xl border-2 border-tiko-outline-variant object-contain p-1 bg-white shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-28 h-28 rounded-xl border-2 border-dashed border-tiko-outline-variant flex flex-col items-center justify-center gap-1 text-tiko-outline hover:border-tiko-primary hover:text-tiko-primary hover:bg-tiko-primary/5 transition-all"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-[10px] font-bold leading-tight text-center px-1">Upload QR</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleQrChange} />
          {qrFile && (
            <button
              type="button"
              onClick={handleUploadQr}
              disabled={uploadQrMutation.isPending}
              className="mt-2 w-full px-2 py-1.5 text-[11px] font-bold bg-tiko-primary text-white rounded-lg hover:bg-tiko-primary/90 disabled:opacity-50 transition-colors"
            >
              {uploadQrMutation.isPending ? 'Uploading…' : 'Save QR'}
            </button>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <Field label="Instapay Email / IPA">
            <input
              type="text"
              value={cfg.email ?? ''}
              onChange={(e) => setCfg((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. yourname@instapay"
              className="w-full px-3 py-2.5 text-sm border border-tiko-outline-variant rounded-xl focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
            />
          </Field>
          <Field label="Phone Number">
            <input
              type="tel"
              value={cfg.phone ?? ''}
              onChange={(e) => setCfg((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="e.g. 01012345678"
              className="w-full px-3 py-2.5 text-sm border border-tiko-outline-variant rounded-xl focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
            />
          </Field>
        </div>
      </div>

      <Field
        label="Payment Link"
        hint="Direct Instapay payment link shown to customers"
      >
        <input
          type="url"
          value={cfg.paymentLink ?? ''}
          onChange={(e) => setCfg((prev) => ({ ...prev, paymentLink: e.target.value }))}
          placeholder="https://ipn.eg/S/..."
          className="w-full px-3 py-2.5 text-sm border border-tiko-outline-variant rounded-xl focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
        />
      </Field>

      {methodEnabled && !atLeastOne && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-600 font-bold">
            At least one of Email, Phone, or Payment Link is required when Instapay is enabled.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(cfg)}
          disabled={isSaving || !canSave}
          className="px-6 py-2.5 bg-tiko-primary text-white text-sm font-bold rounded-xl hover:bg-tiko-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Method Card ──────────────────────────────────────────────────────────────
const MethodCard: React.FC<{
  method: PaymentMethodConfig;
  onUpdate: (id: string, isEnabled: boolean, config: InstapayConfig) => void;
  isUpdating: boolean;
}> = ({ method, onUpdate, isUpdating }) => {
  const [expanded, setExpanded] = useState(false);

  const isCash = method.id === 'CASH';
  const isInstapay = method.id === 'INSTAPAY';
  const cfg = method.config as InstapayConfig;

  const handleToggle = (val: boolean) => {
    if (isInstapay && val) setExpanded(true);
    onUpdate(method.id, val, cfg);
  };

  return (
    <div className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden
      ${method.isEnabled ? 'border-tiko-primary/30 bg-tiko-primary/2' : 'border-tiko-outline-variant bg-white'}`}
    >
      <div className="flex items-center gap-4 p-5">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${method.isEnabled ? 'bg-tiko-primary/10' : 'bg-tiko-surface-container'}`}
        >
          {isCash ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              className={method.isEnabled ? 'text-tiko-primary' : 'text-tiko-outline'}>
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              className={method.isEnabled ? 'text-tiko-primary' : 'text-tiko-outline'}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-outfit font-bold text-sm text-tiko-on-surface">{method.name}</p>
          <p className="text-xs text-tiko-on-surface-variant mt-0.5">
            {isCash ? 'Customer pays cash upon delivery' : 'Customer transfers via Instapay app'}
          </p>
          {isInstapay && method.isEnabled && cfg?.email && (
            <p className="text-[11px] text-tiko-primary font-bold mt-0.5 truncate">{cfg.email}</p>
          )}
        </div>

        {/* Status badge */}
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold mr-1 transition-colors
          ${method.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
        >
          {method.isEnabled ? 'Active' : 'Inactive'}
        </span>

        {/* Toggle */}
        <Toggle enabled={method.isEnabled} onChange={handleToggle} disabled={isUpdating} />

        {/* Expand button (Instapay only) */}
        {isInstapay && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-tiko-surface-container transition-colors text-tiko-on-surface-variant"
            aria-label={expanded ? 'Collapse config' : 'Expand config'}
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Instapay Config Panel */}
      {isInstapay && expanded && (
        <div className="px-5 pb-5">
          <InstapayConfigPanel
            methodEnabled={method.isEnabled}
            initialConfig={cfg ?? {}}
            onSave={(newCfg) => onUpdate(method.id, method.isEnabled, newCfg)}
            isSaving={isUpdating}
          />
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const PaymentMethodsSettings: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: methods, isLoading } = useQuery<PaymentMethodConfig[]>({
    queryKey: ['admin', 'payment-methods'],
    queryFn: paymentMethodService.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, isEnabled, config }: { id: string; isEnabled: boolean; config: InstapayConfig }) =>
      paymentMethodService.update(id, { isEnabled, config }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payment-methods'] });
      queryClient.invalidateQueries({ queryKey: ['payment-methods', 'enabled'] });
      toast.success('Payment method updated');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update payment method'));
    },
  });

  const handleUpdate = (id: string, isEnabled: boolean, config: InstapayConfig) => {
    updateMutation.mutate({ id, isEnabled, config });
  };

  return (
    <div className="bg-white border border-tiko-outline-variant rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-tiko-outline-variant bg-tiko-surface-container-low/50">
        <div className="w-9 h-9 rounded-xl bg-tiko-primary/10 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tiko-primary">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <div>
          <h3 className="font-outfit font-bold text-base text-tiko-on-surface">Payment Methods</h3>
          <p className="text-xs text-tiko-on-surface-variant mt-0.5">
            Control which payment options are available to customers at checkout
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin h-7 w-7 text-tiko-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          methods?.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              onUpdate={handleUpdate}
              isUpdating={updateMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Info footer */}
      <div className="px-6 pb-5">
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-xs text-blue-700 leading-snug">
            Changes take effect immediately. Customers only see active payment methods at checkout.
            At least one method must be configured for the store to accept orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsSettings;
