/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScanResult } from '../../types';
import { RiskBadge } from './RiskBadge';
import { ShieldAlert, Zap, BookOpen, AlertOctagon, CheckCircle2, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface ThreatCardProps {
  scan: ScanResult;
  onSimulate?: (scan: ScanResult) => void;
  onExplain?: (scan: ScanResult) => void;
  onBlock?: (scan: ScanResult) => void;
  className?: string;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({
  scan,
  onSimulate,
  onExplain,
  onBlock,
  className = '',
}) => {
  const [showRedFlags, setShowRedFlags] = useState(false);
  const isThreat = scan.classification !== 'safe';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-[#0A0E1A] font-sans transition-all ${
        isThreat
          ? 'border-rose-500/50 shadow-md'
          : 'border-emerald-500/40 shadow-sm'
      } ${className}`}
    >
      {/* Top Threat Classification Accent Bar */}
      <div
        className={`h-1 w-full ${
          isThreat ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />

      <div className="p-4 sm:p-5">
        
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap font-mono text-[11px]">
              <span className="uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                [{scan.inputType.toUpperCase()}]
              </span>
              <span className="text-slate-500">
                ID: {scan.scanId}
              </span>
              <span className="text-slate-500">
                {new Date(scan.timestamp).toLocaleTimeString('vi-VN')}
              </span>
              {scan.piiRedactedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  <Lock className="w-2.5 h-2.5" />
                  <span>ĐÃ ẨN {scan.piiRedactedCount} PII</span>
                </span>
              )}
            </div>

            {/* Target Value Hash / URL */}
            <p className="font-mono text-xs sm:text-sm text-slate-100 font-semibold truncate break-all bg-slate-950/80 p-2 rounded border border-slate-800">
              {scan.sanitizedValue}
            </p>
          </div>

          <RiskBadge classification={scan.classification} riskScore={scan.riskScore} size="lg" />
        </div>

        {/* Risk Level Gauge Bar */}
        <div className="mb-3 font-mono">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">CHỈ SỐ RỦI RO GEMINI FLASH:</span>
            <span className={isThreat ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {scan.riskScore}/100 ({scan.classification.toUpperCase()})
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-700 ${
                scan.riskScore >= 70
                  ? 'bg-rose-500'
                  : scan.riskScore >= 35
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${scan.riskScore}%` }}
            />
          </div>
        </div>

        {/* AI Summary Statement */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-3">
          <div className="font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1">
            {isThreat ? <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>ĐÁNH GIÁ CỦA AI THREAT AGENT:</span>
          </div>
          <p>{scan.geminiExplanation}</p>
        </div>

        {/* Red Flags List */}
        {scan.redFlags && scan.redFlags.length > 0 && (
          <div className="mb-3 font-mono">
            <button
              onClick={() => setShowRedFlags(!showRedFlags)}
              className="flex items-center justify-between w-full text-xs font-bold text-rose-400 hover:text-rose-300 mb-1.5"
            >
              <span>[!] DẤU HIỆU BẤT THƯỜNG PHÁT HIỆN ({scan.redFlags.length}):</span>
              {showRedFlags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRedFlags && (
              <div className="space-y-1.5">
                {scan.redFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200"
                  >
                    <div className="flex items-center justify-between font-bold mb-0.5">
                      <span>🚩 {flag.label}</span>
                      <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-rose-900 text-rose-300 border border-rose-500/40">
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-sans">{flag.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        {isThreat && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 flex-wrap font-mono">
            <button
              onClick={() => onBlock?.(scan)}
              className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/90 border border-rose-500/50 text-rose-300 font-bold text-xs hover:bg-rose-900 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CHẶN TÊN MIỀN</span>
            </button>

            <button
              onClick={() => onSimulate?.(scan)}
              className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-purple-950/90 border border-purple-500/50 text-purple-300 font-bold text-xs hover:bg-purple-900 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>MÔ PHỎNG</span>
            </button>

            <button
              onClick={() => onExplain?.(scan)}
              className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-bold text-xs hover:bg-cyan-900 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>GIẢI THÍCH</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
