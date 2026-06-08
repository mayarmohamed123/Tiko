import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deliveryService } from '../../../services/deliveryService';
import type { AdminDeliveryZone } from '../../../services/deliveryService';
import { getErrorMessage } from '../../../utils/getErrorMessage';

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle: React.FC<{ enabled: boolean; onChange: () => void; disabled?: boolean }> = ({
  enabled,
  onChange,
  disabled,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tiko-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
      ${enabled ? 'bg-tiko-primary' : 'bg-tiko-outline-variant'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200
        ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    className="animate-spin text-tiko-primary"
    style={{ width: size, height: size }}
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Zone Form (create / edit inline) ────────────────────────────────────────
interface ZoneFormProps {
  initial?: Partial<AdminDeliveryZone>;
  onSave: (values: { name: string; code: string; fee: number }) => void;
  onCancel: () => void;
  isSaving: boolean;
  mode: 'create' | 'edit';
}

const ZoneForm: React.FC<ZoneFormProps> = ({ initial, onSave, onCancel, isSaving, mode }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [fee, setFee] = useState(initial?.fee?.toString() ?? '');
  const [codeEdited, setCodeEdited] = useState(mode === 'edit');

  // Auto-generate code from name when creating
  const handleNameChange = (v: string) => {
    setName(v);
    if (!codeEdited) {
      setCode(v.trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, ''));
    }
  };

  const handleCodeChange = (v: string) => {
    setCodeEdited(true);
    setCode(v.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, ''));
  };

  const feeNum = parseFloat(fee);
  const isValid = name.trim().length > 0 && code.trim().length > 0 && !isNaN(feeNum) && feeNum >= 0;

  return (
    <div className="border border-tiko-primary/30 rounded-2xl p-5 bg-tiko-primary/3 space-y-4 animate-fade-in">
      <p className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">
        {mode === 'create' ? 'New Delivery Zone' : 'Edit Zone'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Name */}
        <div className="sm:col-span-1 space-y-1">
          <label className="block text-[11px] font-bold text-tiko-on-surface-variant uppercase tracking-wider">
            Zone Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Cairo"
            className="w-full px-3 py-2.5 text-sm border border-tiko-outline-variant rounded-xl focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
          />
        </div>

        {/* Code */}
        <div className="sm:col-span-1 space-y-1">
          <label className="block text-[11px] font-bold text-tiko-on-surface-variant uppercase tracking-wider">
            Zone Code
            <span className="ml-1 font-normal normal-case tracking-normal text-tiko-outline">(unique, auto-generated)</span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="CAIRO"
            className="w-full px-3 py-2.5 text-sm font-mono border border-tiko-outline-variant rounded-xl focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
          />
        </div>

        {/* Fee */}
        <div className="sm:col-span-1 space-y-1">
          <label className="block text-[11px] font-bold text-tiko-on-surface-variant uppercase tracking-wider">
            Delivery Fee (EGP)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.5"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="0.00"
              className="w-full pl-3 pr-14 py-2.5 text-sm border border-tiko-outline-variant rounded-xl focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-tiko-outline font-bold">EGP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-tiko-on-surface-variant hover:text-tiko-on-surface border border-tiko-outline-variant rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave({ name: name.trim(), code: code.trim(), fee: feeNum })}
          disabled={!isValid || isSaving}
          className="px-6 py-2 bg-tiko-primary text-white text-sm font-bold rounded-xl hover:bg-tiko-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <><Spinner size={14} /> Saving…</> : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {mode === 'create' ? 'Add Zone' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Zone Row ─────────────────────────────────────────────────────────────────
interface ZoneRowProps {
  zone: AdminDeliveryZone;
  onToggle: (id: string) => void;
  onEdit: (zone: AdminDeliveryZone) => void;
  onDelete: (id: string) => void;
  isTogglingId: string | null;
  isDeletingId: string | null;
}

const ZoneRow: React.FC<ZoneRowProps> = ({ zone, onToggle, onEdit, onDelete, isTogglingId, isDeletingId }) => {
  const isToggling = isTogglingId === zone.id;
  const isDeleting = isDeletingId === zone.id;

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200
        ${zone.isActive ? 'border-tiko-primary/25 bg-tiko-primary/[0.02]' : 'border-tiko-outline-variant bg-white opacity-70'}`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
        ${zone.isActive ? 'bg-tiko-primary/10' : 'bg-tiko-surface-container'}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          className={zone.isActive ? 'text-tiko-primary' : 'text-tiko-outline'}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-outfit font-bold text-sm text-tiko-on-surface">{zone.name}</p>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-tiko-surface-container text-tiko-on-surface-variant">
            {zone.code}
          </span>
        </div>
        <p className="text-sm font-bold text-tiko-primary mt-0.5">{zone.fee.toFixed(2)} EGP</p>
      </div>

      {/* Status badge */}
      <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0
        ${zone.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {zone.isActive ? 'Active' : 'Inactive'}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle */}
        {isToggling ? (
          <Spinner size={20} />
        ) : (
          <Toggle enabled={zone.isActive} onChange={() => onToggle(zone.id)} />
        )}

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(zone)}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-tiko-surface-container text-tiko-on-surface-variant hover:text-tiko-primary transition-colors"
          aria-label="Edit zone"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        {/* Delete */}
        {isDeleting ? (
          <Spinner size={16} />
        ) : (
          <button
            type="button"
            onClick={() => onDelete(zone.id)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-tiko-outline hover:text-tiko-error transition-colors"
            aria-label="Delete zone"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const DeliveryZonesSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingZone, setEditingZone] = useState<AdminDeliveryZone | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: zones = [], isLoading } = useQuery<AdminDeliveryZone[]>({
    queryKey: ['admin', 'delivery-zones'],
    queryFn: deliveryService.adminList,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'delivery-zones'] });
    // Also invalidate the public checkout query so the dropdown updates immediately
    queryClient.invalidateQueries({ queryKey: ['delivery-zones'] });
  };

  const createMutation = useMutation({
    mutationFn: deliveryService.create,
    onSuccess: () => {
      invalidate();
      setShowCreateForm(false);
      toast.success('Delivery zone created');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to create zone')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; code?: string; fee?: number } }) =>
      deliveryService.update(id, payload),
    onSuccess: () => {
      invalidate();
      setEditingZone(null);
      toast.success('Delivery zone updated');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to update zone')),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => deliveryService.toggle(id),
    onMutate: (id) => setTogglingId(id),
    onSettled: () => setTogglingId(null),
    onSuccess: () => {
      invalidate();
      toast.success('Zone status updated');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to toggle zone')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deliveryService.remove(id),
    onMutate: (id) => setDeletingId(id),
    onSettled: () => setDeletingId(null),
    onSuccess: () => {
      invalidate();
      toast.success('Zone deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to delete zone')),
  });

  const handleDelete = (id: string) => {
    const zone = zones.find((z) => z.id === id);
    if (!zone) return;
    if (!window.confirm(`Delete "${zone.name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="bg-white border border-tiko-outline-variant rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-tiko-outline-variant bg-tiko-surface-container-low/50">
        <div className="w-9 h-9 rounded-xl bg-tiko-primary/10 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tiko-primary">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-outfit font-bold text-base text-tiko-on-surface">Delivery Zones</h3>
          <p className="text-xs text-tiko-on-surface-variant mt-0.5">
            Set governorates / areas and their delivery fees — shown to customers at checkout
          </p>
        </div>
        {/* Add button */}
        {!showCreateForm && !editingZone && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-tiko-primary text-white text-xs font-bold rounded-xl hover:bg-tiko-primary/90 active:scale-[0.97] transition-all shadow-sm shadow-tiko-primary/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Zone
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Create form */}
        {showCreateForm && (
          <ZoneForm
            mode="create"
            onSave={(v) => createMutation.mutate(v)}
            onCancel={() => setShowCreateForm(false)}
            isSaving={createMutation.isPending}
          />
        )}

        {/* Zone list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size={28} />
          </div>
        ) : zones.length === 0 && !showCreateForm ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-tiko-surface-container flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-tiko-outline">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <p className="font-outfit font-bold text-sm text-tiko-on-surface">No delivery zones yet</p>
              <p className="text-xs text-tiko-on-surface-variant mt-1">Add your first zone to offer region-based shipping fees.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-1 px-5 py-2 bg-tiko-primary text-white text-sm font-bold rounded-xl hover:bg-tiko-primary/90 transition-all shadow-sm"
            >
              Add First Zone
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {zones.map((zone) =>
              editingZone?.id === zone.id ? (
                <ZoneForm
                  key={zone.id}
                  mode="edit"
                  initial={editingZone}
                  onSave={(v) => updateMutation.mutate({ id: zone.id, payload: v })}
                  onCancel={() => setEditingZone(null)}
                  isSaving={updateMutation.isPending}
                />
              ) : (
                <ZoneRow
                  key={zone.id}
                  zone={zone}
                  onToggle={(id) => toggleMutation.mutate(id)}
                  onEdit={setEditingZone}
                  onDelete={handleDelete}
                  isTogglingId={togglingId}
                  isDeletingId={deletingId}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Info footer */}
      {zones.length > 0 && (
        <div className="px-6 pb-5">
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600 shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="text-xs text-blue-700 leading-snug">
              Only <strong>active</strong> zones appear in the customer checkout. Inactive zones are hidden but preserved in past orders.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryZonesSettings;
