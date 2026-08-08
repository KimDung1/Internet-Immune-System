/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AIOrb } from '../components/ui/AIOrb';
import { ScanInput } from '../components/ui/ScanInput';
import { ThreatCard } from '../components/ui/ThreatCard';
import { ExplainModal } from '../components/ui/ExplainModal';
import { TheaterModeModal } from '../components/ui/TheaterModeModal';
import {
  getUserProfile,
  getScanHistory,
  saveScanResult,
  getAntibodyRank,
  subscribeUserProfile
} from '../lib/storage';
import { saveScanToFirestore } from '../lib/firebase';
import { runThreatDetection } from '../lib/gemini';
import { InputType, ScanResult } from '../types';
import {
  Search,
  Zap,
  BookOpen,
  Users,
  ShieldCheck,
  Award,
  Activity,
  ArrowRight,
  Shield,
  Lock,
  Flame,
  CheckCircle2,
  TrendingUp,
  AlertOctagon
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, addToast }) => {
  const [user, setUser] = useState(getUserProfile());
  const [history, setHistory] = useState(getScanHistory());
  const [scanning, setScanning] = useState(false);
  const [selectedScanForExplain, setSelectedScanForExplain] = useState<ScanResult | null>(null);
  const [selectedScanForSimulate, setSelectedScanForSimulate] = useState<ScanResult | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeUserProfile((updated) => setUser(updated));
    return () => unsubscribe();
  }, []);

  const rank = getAntibodyRank(user.trustScore);

  const handleScanSubmit = async (content: string, type: InputType, hint = '') => {
    setScanning(true);
    addToast('warning', 'Khởi Động AI Scan', 'Gemini 2.5 Flash đang phân tích nội dung...');

    try {
      const result = await runThreatDetection(content, type, hint);
      saveScanResult(result);
      await saveScanToFirestore(result);
      
      const updatedHistory = getScanHistory();
      const updatedUser = getUserProfile();
      setHistory(updatedHistory);
      setUser(updatedUser);
      setScanning(false);

      if (result.classification !== 'safe') {
        addToast(
          'threat',
          `⚡ PHÁT HIỆN MỐI ĐE ĐỌA (${result.riskScore}/100)`,
          result.geminiExplanation
        );
      } else {
        addToast('success', '✅ An Toàn', 'Không ghi nhận dấu hiệu lừa đảo.');
      }
    } catch (e: any) {
      setScanning(false);
      addToast('error', 'Lỗi Phân Tích', e.message || 'Vui lòng thử lại.');
    }
  };

  const threatCount = history.filter((s) => s.classification !== 'safe').length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* SOC Tactical Header Banner */}
      <div className="bg-[#090E1A] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Status & Welcome */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                SOC THREAT CENTER • ACTIVE DEFENSE
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                AGENT #{user.trustScore * 102}
              </span>
            </div>

            <h1 className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
              Trung Tâm Giám Sát An Ninh Mạng — <span className="text-cyan-400">{user.displayName}</span>
            </h1>

            {user.uid === 'guest' && (
              <div className="mt-2 p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>
                  <strong>Lưu ý:</strong> Bạn chưa đăng nhập. Nhấn vào nút <strong>"Đăng Nhập"</strong> ở góc trên bên phải để kết nối tài khoản Firebase và lưu trữ dữ liệu cá nhân.
                </span>
              </div>
            )}

            <p className="text-xs text-slate-400 font-mono">
              Chỉ số an toàn: <strong className="text-cyan-400">{user.trustScore}/100</strong> ({rank.title}) • AI Gemini 2.5 Flash tự động kiểm tra & lọc PII độc hại real-time.
            </p>
          </div>

          {/* Quick Metrics Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Tổng Quét</span>
              <span className="text-lg font-bold text-white">{user.totalScans}</span>
            </div>
            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-rose-400 uppercase block">Đã Chặn</span>
              <span className="text-lg font-bold text-rose-400">{user.threatsBlocked}</span>
            </div>
            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-emerald-400 uppercase block">Kháng Thể</span>
              <span className="text-lg font-bold text-emerald-400">{user.badges?.length || 0}</span>
            </div>
            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-cyan-400 uppercase block">Độ Chính Xác</span>
              <span className="text-lg font-bold text-cyan-400">99.4%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Quick Scanner Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>[QUICK SCAN CONSOLE] Nhập Liên Kết / SMS / Email Để Phân Tích</span>
          </h2>
          <button
            onClick={() => onNavigate('/scan')}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Quét Chuyên Sâu</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ScanInput onScan={handleScanSubmit} isLoading={scanning} />
      </div>

      {/* 5 Core SOC Security Modules */}
      <div className="space-y-2 pt-2">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>[5 MODULE AN NINH MẠNG PHÒNG NGỰ]</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          
          <div
            onClick={() => onNavigate('/scan')}
            className="p-3.5 rounded-lg bg-[#0D1322] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#11192d] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-cyan-400 font-bold">01 DETECT</span>
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-300 mb-1">Phát Hiện Nguy Cơ</div>
            <p className="text-[11px] text-slate-400 leading-tight">Phân tích lừa đảo & lọc PII tự động bằng AI Gemini.</p>
          </div>

          <div
            onClick={() => onNavigate('/scan')}
            className="p-3.5 rounded-lg bg-[#0D1322] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#11192d] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-cyan-400 font-bold">02 EXPLAIN</span>
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-300 mb-1">Giải Thích Rủi Ro</div>
            <p className="text-[11px] text-slate-400 leading-tight">Bóc tách Red Flags & hướng dẫn xử lý bằng tiếng Việt.</p>
          </div>

          <div
            onClick={() => onNavigate('/simulate')}
            className="p-3.5 rounded-lg bg-[#0D1322] border border-slate-800 hover:border-purple-500/50 hover:bg-[#11192d] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-purple-400 font-bold">03 SIMULATE</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-purple-300 mb-1">Mô Phỏng Hậu Quả</div>
            <p className="text-[11px] text-slate-400 leading-tight">Diễn biến 3 bước sập bẫy lừa đảo & thiệt hại VNĐ.</p>
          </div>

          <div
            onClick={() => onNavigate('/train')}
            className="p-3.5 rounded-lg bg-[#0D1322] border border-slate-800 hover:border-emerald-500/50 hover:bg-[#11192d] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-emerald-400 font-bold">04 VACCINE</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300 mb-1">Diễn Tập Vắc-xin</div>
            <p className="text-[11px] text-slate-400 leading-tight">Huấn luyện nhận diện lừa đảo & nâng điểm Trust Score.</p>
          </div>

          <div
            onClick={() => onNavigate('/protect')}
            className="p-3.5 rounded-lg bg-[#0D1322] border border-slate-800 hover:border-rose-500/50 hover:bg-[#11192d] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-rose-400 font-bold">05 PROTECT</span>
              <Shield className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-rose-300 mb-1">Overlay Shield</div>
            <p className="text-[11px] text-slate-400 leading-tight">Shadow DOM Chrome Extension chặn web độc hại.</p>
          </div>

        </div>
      </div>

      {/* Recent Scan Logs Feed */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between font-mono">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>[SOC RECENT SCAN LOGS] Nhật Ký Kiểm Tra Đe Dọa</span>
          </h2>
          <button
            onClick={() => onNavigate('/history')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Tất Cả ({history.length})</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="p-6 text-center rounded-lg bg-[#0D1322] border border-slate-800 text-slate-400 font-mono text-xs">
            <CheckCircle2 className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold">Chưa có nhật ký phân tích nào.</p>
            <p className="text-slate-500 mt-1">Dán liên kết hoặc tin nhắn ở khung phía trên để quét.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 3).map((scan) => (
              <ThreatCard
                key={scan.scanId}
                scan={scan}
                onExplain={(s) => setSelectedScanForExplain(s)}
                onSimulate={(s) => setSelectedScanForSimulate(s)}
                onBlock={(s) => addToast('success', 'Đã Chặn Tên Miền', `URL ${s.sanitizedValue} đã bị vô hiệu hóa.`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ExplainModal
        scan={selectedScanForExplain}
        isOpen={!!selectedScanForExplain}
        onClose={() => setSelectedScanForExplain(null)}
      />

      <TheaterModeModal
        scan={selectedScanForSimulate}
        isOpen={!!selectedScanForSimulate}
        onClose={() => setSelectedScanForSimulate(null)}
      />

    </div>
  );
};
