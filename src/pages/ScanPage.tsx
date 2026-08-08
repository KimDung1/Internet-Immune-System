/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScanInput } from '../components/ui/ScanInput';
import { ThreatCard } from '../components/ui/ThreatCard';
import { ExplainModal } from '../components/ui/ExplainModal';
import { TheaterModeModal } from '../components/ui/TheaterModeModal';
import { runThreatDetection } from '../lib/gemini';
import { saveScanResult, getScanHistory } from '../lib/storage';
import { saveScanToFirestore } from '../lib/firebase';
import { InputType, ScanResult } from '../types';
import { Search, Zap, ShieldAlert, CheckCircle2, Lock, ArrowLeft, History } from 'lucide-react';

interface ScanPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const ScanPage: React.FC<ScanPageProps> = ({ onNavigate, addToast }) => {
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    if (!scanning) { setScanStep(0); return; }
    const steps = ['1. Lọc thông tin nhạy cảm PII...', '2. Đối chiếu cơ sở dữ liệu lừa đảo...', '3. Phân tích ngữ cảnh AI Gemini 2.5 Flash...'];
    const timer = setInterval(() => {
      setScanStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [scanning]);
  const [explainScan, setExplainScan] = useState<ScanResult | null>(null);
  const [simulateScan, setSimulateScan] = useState<ScanResult | null>(null);

  const handleScanSubmit = async (content: string, type: InputType, hint = '') => {
    setScanning(true);
    addToast('warning', 'Đang Phân Tích Bằng AI...', 'Gemini 2.5 Flash đang lọc PII và kiểm tra tên miền...');

    try {
      const result = await runThreatDetection(content, type, hint);
      saveScanResult(result);
      await saveScanToFirestore(result);
      setCurrentScan(result);
      setScanning(false);

      if (result.classification !== 'safe') {
        addToast(
          'threat',
          `⚡ PHÁT HIỆN MỐI ĐE ĐỌA! (Mức Rủi Ro: ${result.riskScore}/100)`,
          result.geminiExplanation
        );
      } else {
        addToast('success', '✅ Nội Dung An Toàn', 'Không tìm thấy dấu hiệu bất thường.');
      }
    } catch (e: any) {
      setScanning(false);
      addToast('error', 'Lỗi Phân Tích', e.message || 'Vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">
                [MODULE DETECT] Phân Tích & Phát Hiện Mối Đe Dọa
              </h1>
              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded">
                GEMINI 2.5 FLASH
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Kiểm tra URL, SMS, Email • Tự động mã hóa & lọc PII (CCCD, SĐT, STK) trước khi phân tích.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/history')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>Lịch Sử Log</span>
        </button>
      </div>

      {/* Main Input Form */}
      <div className="space-y-2">
        <ScanInput onScan={handleScanSubmit} isLoading={scanning} />
      </div>

      {/* Scanning Live Radar Overlay State */}
      {scanning && (
        <div className="p-8 rounded-lg bg-[#080C16] border border-cyan-500/40 text-center space-y-3 font-mono shadow-md">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-white">ĐANG THỰC THI THREAT SCANNER...</h3>
            <p className="text-[11px] text-cyan-300">
              {['1. Lọc thông tin nhạy cảm PII...', '2. Đối chiếu cơ sở dữ liệu lừa đảo...', '3. Phân tích ngữ cảnh AI Gemini 2.5 Flash...'][scanStep]}
              <span className="animate-blink">▌</span>
            </p>
          </div>
        </div>
      )}

      {/* Scan Result Output */}
      {currentScan && !scanning && (
        <div className="space-y-3 pt-2 animate-fadeIn animate-slideInUp font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>KẾT QUẢ PHÂN TÍCH TỔNG QUAN:</span>
            <span>SCAN ID: {currentScan.scanId}</span>
          </div>

          <ThreatCard
            scan={currentScan}
            onExplain={(s) => setExplainScan(s)}
            onSimulate={(s) => setSimulateScan(s)}
            onBlock={() => addToast('success', 'Đã Chặn Tên Miền', 'Đã lưu liên kết vào danh sách chặn của bạn.')}
          />
        </div>
      )}

      {/* Modals */}
      <ExplainModal
        scan={explainScan}
        isOpen={!!explainScan}
        onClose={() => setExplainScan(null)}
      />

      <TheaterModeModal
        scan={simulateScan}
        isOpen={!!simulateScan}
        onClose={() => setSimulateScan(null)}
      />

    </div>
  );
};
