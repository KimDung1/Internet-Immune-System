/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClassificationType } from '../../types';
import { ShieldCheck, AlertTriangle, ShieldAlert, Bug, Flame } from 'lucide-react';

interface RiskBadgeProps {
  classification: ClassificationType;
  riskScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  classification,
  riskScore,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const configs = {
    safe: {
      label: 'AN TOÀN',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      icon: ShieldCheck,
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    },
    suspicious: {
      label: 'NGHI NGỜ',
      bg: 'bg-amber-950/80',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      icon: AlertTriangle,
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    },
    phishing: {
      label: 'GIẢ MẠO (PHISHING)',
      bg: 'bg-rose-950/90',
      border: 'border-rose-500/60',
      text: 'text-rose-400 animate-pulse',
      icon: ShieldAlert,
      glow: 'shadow-[0_0_15px_rgba(243,24,68,0.4)]',
    },
    malware: {
      label: 'MÃ ĐỘC (MALWARE)',
      bg: 'bg-purple-950/90',
      border: 'border-purple-500/60',
      text: 'text-purple-300',
      icon: Bug,
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    },
    scam: {
      label: 'LỪA ĐẢO (SCAM)',
      bg: 'bg-red-950/90',
      border: 'border-red-500/60',
      text: 'text-red-400 animate-pulse',
      icon: Flame,
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    },
  };

  const config = configs[classification] || configs.suspicious;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded-lg border backdrop-blur-md transition-all ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
      {riskScore !== undefined && (
        <span className="ml-1 opacity-80 border-l border-current/30 pl-1 font-bold">
          {riskScore}/100
        </span>
      )}
    </span>
  );
};
