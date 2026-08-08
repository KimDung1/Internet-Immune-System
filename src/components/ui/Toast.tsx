/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'threat' | 'danger' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const configs = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    error: {
      bg: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
      icon: ShieldAlert,
      color: 'text-rose-400',
    },
    danger: {
      bg: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
      icon: ShieldAlert,
      color: 'text-rose-400',
    },
    info: {
      bg: 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200',
      icon: Info,
      color: 'text-cyan-400',
    },
    warning: {
      bg: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
    threat: {
      bg: 'bg-red-950/95 border-red-500/70 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      icon: ShieldAlert,
      color: 'text-red-400 animate-pulse',
    },
  };

  const config = configs[toast.type] || configs.success;
  const Icon = config.icon;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all ${config.bg}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`} />
      <div className="flex-1 min-w-0 text-xs">
        <h4 className="font-bold text-white mb-0.5">{toast.title}</h4>
        {toast.description && <p className="opacity-80 leading-relaxed">{toast.description}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-white rounded-lg"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
