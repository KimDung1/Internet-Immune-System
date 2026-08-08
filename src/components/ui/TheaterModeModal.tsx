/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScanResult, SimulationResult } from '../../types';
import { runSimulationTheater } from '../../lib/gemini';
import { Zap, AlertTriangle, ShieldCheck, Flame, X, Play, RotateCcw, DollarSign } from 'lucide-react';

interface TheaterModeModalProps {
  scan: ScanResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TheaterModeModal: React.FC<TheaterModeModalProps> = ({ scan, isOpen, onClose }) => {
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && scan) {
      setLoading(true);
      setActiveStepIndex(0);
      runSimulationTheater(scan).then((res) => {
        if (isMounted) {
          setSimulation(res);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, scan]);

  useEffect(() => {
    let timer: any;
    if (autoPlay && simulation && activeStepIndex < simulation.steps.length - 1) {
      timer = setTimeout(() => {
        setActiveStepIndex((prev) => prev + 1);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, simulation, activeStepIndex]);

  if (!isOpen || !scan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl bg-[#090E1A] border border-rose-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(239,68,68,0.3)] text-white max-h-[95vh] overflow-y-auto">
        
        {/* Theater Header */}
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-500/50 text-rose-400 animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-xl text-white tracking-wide">
                  RẠP MÔ PHỎNG HẬU QUẢ (Consequence Theater)
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold bg-rose-950 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded">
                  Theater Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI Giả Lập Diễn Biến Thiệt Hại Tài Chính Nếu Bạn Nhấp Vào Liên Kết Lừa Đảo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-rose-500/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-mono text-rose-300">SimulationAgent Đang Dựng Kịch Bản Thiệt Hại...</p>
          </div>
        ) : (
          simulation && (
            <div className="space-y-6">
              
              {/* Target & Loss Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                  <span className="text-slate-500">Mục tiêu mô phỏng:</span>
                  <p className="text-cyan-300 font-bold truncate">{scan.sanitizedValue}</p>
                </div>
                
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-center flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-mono text-rose-300">Ước Tính Thiệt Hại Tài Chính</span>
                  <div className="font-display font-black text-2xl text-rose-400 flex items-center justify-center gap-1">
                    <DollarSign className="w-5 h-5" />
                    <span>{simulation.potentialLossVnd}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Step Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <span className="text-slate-400">Tiến Trình Diễn Biến Lừa Đảo (T+):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Play className={`w-3 h-3 ${autoPlay ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{autoPlay ? 'Tự Động Chạy' : 'Tạm Dừng'}</span>
                  </button>
                  <button
                    onClick={() => setActiveStepIndex(0)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Interactive Timeline 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {simulation.steps.map((st, i) => {
                  const isActive = i === activeStepIndex;
                  const isPassed = i < activeStepIndex;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setActiveStepIndex(i);
                        setAutoPlay(false);
                      }}
                      className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-950/90 border-rose-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-105 z-10'
                          : isPassed
                          ? 'bg-slate-900/80 border-slate-700 text-slate-300 opacity-90'
                          : 'bg-slate-950/50 border-slate-900 text-slate-500'
                      }`}
                    >
                      {/* Step Number Badge */}
                      <div className="flex items-center justify-between mb-3 font-mono">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isActive ? 'bg-rose-500 text-black' : 'bg-slate-800 text-slate-400'
                        }`}>
                          0{st.step}
                        </span>
                        <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                          {st.timestampLabel}
                        </span>
                      </div>

                      <h4 className={`font-bold text-sm mb-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {st.title}
                      </h4>
                      <p className="text-xs leading-relaxed opacity-90">{st.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Closing Neutralization Message */}
              <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm leading-relaxed space-y-2 text-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <div className="font-display font-black text-emerald-400 text-base flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>KẾT QUẢ: MỐI ĐE ĐỌA ĐÃ BỊ TRIỆU TIÊU</span>
                </div>
                <p>{simulation.closingMessage}</p>
              </div>

              {/* Footer Modal Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-slate-500">Mô hình: {simulation.generatedByModel}</span>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Quay Lại An Toàn
                </button>
              </div>

            </div>
          )
        )}

      </div>
    </div>
  );
};
