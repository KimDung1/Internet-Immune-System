/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AIOrbProps {
  score: number; // 0 - 100
  state?: 'idle' | 'scanning' | 'threat' | 'protected';
  size?: number; // Default: 260
  showScore?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AIOrb: React.FC<AIOrbProps> = ({
  score,
  state = 'idle',
  size = 260,
  showScore = true,
  showLabel = true,
  onClick,
  className = '',
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const stateColors = {
    idle: {
      gradientStart: '#10B981', // Emerald
      gradientEnd: '#06B6D4', // Cyan
      glow: 'shadow-[0_0_35px_rgba(6,182,212,0.35)]',
      text: 'text-cyan-400',
      label: 'Bình Thường',
    },
    scanning: {
      gradientStart: '#00E5FF',
      gradientEnd: '#3B82F6',
      glow: 'shadow-[0_0_45px_rgba(0,229,255,0.5)] animate-pulse',
      text: 'text-cyan-300',
      label: 'Đang Phân Tích...',
    },
    threat: {
      gradientStart: '#EF4444', // Red
      gradientEnd: '#DC2626',
      glow: 'shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-bounce',
      text: 'text-rose-400',
      label: 'Phát Hiện Đe Dọa!',
    },
    protected: {
      gradientStart: '#10B981',
      gradientEnd: '#059669',
      glow: 'shadow-[0_0_35px_rgba(16,185,129,0.35)]',
      text: 'text-emerald-400',
      label: 'Đã Bảo Vệ An Toàn',
    },
  };

  const currentConfig = stateColors[state] || stateColors.idle;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer group select-none ${className}`}
      style={{ width: size, height: size + (showLabel ? 30 : 0) }}
    >
      {/* Outer Glow Circle */}
      <div
        className={`absolute rounded-full transition-all duration-700 ${currentConfig.glow}`}
        style={{
          width: size * 0.9,
          height: size * 0.9,
          top: size * 0.05,
          left: size * 0.05,
        }}
      />

      {/* Radar scanning line effect */}
      {state === 'scanning' && (
        <div
          className="absolute rounded-full border border-cyan-400/30 animate-ping pointer-events-none"
          style={{ width: size * 0.95, height: size * 0.95 }}
        />
      )}

      {/* Main SVG Gauge Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`orbGradient-${state}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentConfig.gradientStart} />
              <stop offset="100%" stopColor={currentConfig.gradientEnd} />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Filled Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#orbGradient-${state})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            filter="url(#glow-filter)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        {showScore && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              Chỉ Số Kháng Thể
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className={`font-display font-black text-5xl tracking-tight ${currentConfig.text}`}>
                {score}
              </span>
              <span className="text-xs font-bold text-slate-500">/100</span>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
              {currentConfig.label}
            </span>
          </div>
        )}
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span className="text-xs font-mono font-medium text-cyan-400 tracking-wider uppercase flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Hệ Miễn Dịch Internet
          </span>
        </div>
      )}
    </div>
  );
};
