/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { runSimulationTheater, runThreatDetection } from '../lib/gemini';
import { ScanResult, SimulationResult } from '../types';
import { Zap, Play, DollarSign, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

// Animated counter hook for VNĐ loss display
function useCountUp(target: number, duration = 2000, enabled = true): number {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) { setCount(0); return; }
    const startTime = performance.now();
    let animFrame: number;
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };
    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, duration, enabled]);
  return count;
}

// Parse VND string like "50.000.000 VNĐ" to number
function parseVndString(s: string | undefined | null): number {
  if (!s) return 50000000;
  const cleaned = s.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return parsed > 0 ? parsed : 50000000;
}

// Format number to VND display like "50.000.000"
function formatVnd(n: number): string {
  return n.toLocaleString('vi-VN');
}

interface SimulatePageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const SimulatePage: React.FC<SimulatePageProps> = ({ onNavigate, addToast }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('bank_phishing');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const lossTarget = simulation ? parseVndString(simulation.potentialLossVnd) : 0;
  const animatedLoss = useCountUp(lossTarget, 2500, !!simulation && !loading);

  // Auto-play timeline steps
  React.useEffect(() => {
    if (!simulation || loading) return;
    const timers = simulation.steps.map((_, i) => 
      setTimeout(() => setActiveStep(i), (i + 1) * 2000)
    );
    return () => timers.forEach(clearTimeout);
  }, [simulation, loading]);

  const presets = [
    {
      id: 'bank_phishing',
      title: '🌐 Phishing Ngân Hàng Vietcombank',
      input: 'http://vietcombank-secure-login.ph/dang-nhap',
      desc: 'Giả mạo trang đăng nhập ngân hàng thu thập mật khẩu và mã OTP.',
    },
    {
      id: 'job_scam',
      title: '💬 CTV Chốt Đơn Shopee Lợi Nhuận 20%',
      input: 'Mời bạn tham gia làm CTV chốt đơn Shopee hoa hồng 20%. Nạp 500.000đ mở tài khoản tại http://shopee-mall-fast.cc',
      desc: 'Lừa đảo tuyển dụng CTV chốt đơn ảo đa cấp Ponzi.',
    },
    {
      id: 'gov_apk',
      title: '📱 Cài App Dịch Vụ Công Giả Mạo (.apk)',
      input: 'Cán bộ Cục Thuế yêu cầu tải ứng dụng Dịch Vụ Công tại http://dichvucong-gov.net/app.apk để cập nhật dữ liệu.',
      desc: 'Cài mã độc .apk chiếm quyền Accessibility điều khiển điện thoại.',
    },
    {
      id: 'deepfake_call',
      title: '📞 Deepfake Cuộc Gọi Video Công An',
      input: 'Cuộc gọi video AI Deepfake thông báo số CCCD 012345678901 liên quan đường dây ma túy yêu cầu chuyển tiền bảo lãnh.',
      desc: 'Giả dạng công an đe dọa tống tiền tài khoản.',
    },
  ];

  const handleRunSimulation = async (presetId: string) => {
    const found = presets.find((p) => p.id === presetId) || presets[0];
    setLoading(true);
    setActiveStep(0);
    addToast('warning', 'Đang Dựng Kịch Bản AI...', 'SimulationAgent đang tính toán lộ trình thiệt hại tài chính...');

    try {
      const scanRes: ScanResult = await runThreatDetection(found.input, 'text');
      const simRes = await runSimulationTheater(scanRes);
      setSimulation(simRes);
      setLoading(false);
      addToast('threat', '⚡ Đã Tạo Xong Mô Phỏng Hậu Quả!', `Ước tính thiệt hại: ${simRes.potentialLossVnd}`);
    } catch (e: any) {
      setLoading(false);
      addToast('error', 'Lỗi Mô Phỏng', e.message || 'Không thể tạo kịch bản.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Mô Phỏng Hậu Quả (Simulate Mode - Consequence Theater)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 rounded">
                Gemini 2.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Trực Quan Hóa 3 Bước Diễn Biến Lừa Đảo & Tính Toán Thiệt Hại Tài Chính VNĐ Tức Thì
            </p>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-purple-500/30 space-y-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Chọn Kịch Bản Lừa Đảo Mẫu Để Chạy Mô Phỏng:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPreset(p.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-purple-950/80 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="font-bold text-sm text-purple-300">{p.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleRunSimulation(selectedPreset)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-display font-bold text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>AI Đang Tính Toán Thiệt Hại...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Bắt Đầu Mô Phỏng Theater Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Result Render */}
      {simulation && !loading && (
        <div className="p-6 rounded-2xl bg-[#090E1A] border border-rose-500/50 space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.25)] animate-fadeIn animate-threatPulse">
          
          {/* Estimated Loss Banner */}
          <div className="p-5 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-center space-y-1">
            <span className="text-xs uppercase font-mono text-rose-300">Ước Tính Thiệt Hại Tài Chính Nếu Sập Bẫy</span>
            <div className="font-display font-black text-4xl sm:text-5xl text-rose-400 flex items-center justify-center gap-1 animate-countUp">
              <DollarSign className="w-7 h-7" />
              <span>{formatVnd(animatedLoss)} VNĐ</span>
            </div>
            <p className="text-[10px] text-rose-300/70 font-mono mt-1">* Ước tính dựa trên thống kê lừa đảo tại Việt Nam 2024</p>
          </div>

          {/* 3 Step Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {simulation.steps.map((st, i) => {
              const isActive = i === activeStep;
              return (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer animate-slideInUp animate-slideInUp-delay-${i + 1} ${
                    isActive
                      ? 'bg-rose-950/90 border-rose-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] scale-105 z-10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 font-mono">
                    <span className="w-7 h-7 rounded-full bg-rose-500 text-black flex items-center justify-center font-bold text-xs">
                      0{st.step}
                    </span>
                    <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                      {st.timestampLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white mb-2">{st.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{st.description}</p>
                </div>
              );
            })}
          </div>

          {/* Hopeful Neutralization Message */}
          <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm text-center space-y-1">
            <div className="font-display font-bold text-emerald-400 text-base flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>MỐI ĐE ĐỌA ĐÃ BỊ VÔ HIỆU HÓA BỞI HỆ MIỄN DỊCH</span>
            </div>
            <p>{simulation.closingMessage}</p>
          </div>

        </div>
      )}

    </div>
  );
};
