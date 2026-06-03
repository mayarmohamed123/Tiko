import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tiko-on-surface/40 backdrop-blur-sm animate-fade-in font-dm-sans">
      <div className="bg-white rounded-tiko-md border border-tiko-outline-variant shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${isDanger ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-tiko-primary/10 text-tiko-primary border border-tiko-primary/20'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">{title}</h3>
          </div>
          <button 
            onClick={onCancel} 
            className="p-1 hover:bg-tiko-surface-container rounded-full text-tiko-on-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Content */}
        <div className="px-5 pb-6">
          <p className="text-sm text-tiko-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-tiko-surface border-t border-tiko-surface-container-high flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-tiko-outline-variant rounded-full text-sm font-bold text-tiko-on-surface hover:bg-tiko-surface-container transition-all active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-5 py-2 rounded-full text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/10' 
                : 'bg-tiko-primary hover:bg-tiko-primary-container shadow-tiko-primary/10'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
