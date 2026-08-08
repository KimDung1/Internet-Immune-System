/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShadowDOMExtensionShield } from '../components/ui/ShadowDOMExtensionShield';
import { ShieldAlert, Zap, Lock, Globe, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ProtectPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const ProtectPage: React.FC<ProtectPageProps> = ({ onNavigate, addToast }) => {
  const [targetUrl, setTargetUrl] = useState('http://vietcombank-secure-login.ph/dang-nhap');
  const [bypassed, setBypassed] = useState(false);

  const targets = [
    {
      label: '🌐 [Lừa đảo] Fake Vietcombank Phishing',
      url: 'http://vietcombank-secure-login.ph/dang-nhap',
    },
    {
      label: '🌐 [Lừa đảo] Fake Dịch Vụ Công Cục Thuế',
      url: 'http://dichvucong-gov-install.cc/apk',
    },
    {
      label: '🌐 [Lừa đảo] Sàn Crypto Lợi Nhuận 300%',
      url: 'http://nhantien-online-fast.tk/trade',
    },
  ];

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
                Lá Chắn Bảo Vệ Real-time (Protect Mode - Extension Shield)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-500/40 rounded">
                Manifest V3 Shadow DOM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Thử Nghiệm Lá Chắn Chrome Extension Shadow DOM (Closed mode) Cách Ly CSS Tuyệt Đối Trên Web Lừa Đảo
            </p>
          </div>
        </div>
      </div>

      {/* Extension Installation Info & Target Selector */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-rose-500/30 space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Thử Nghiệm Trực Tiếp Trình Chặn Lừa Đảo Real-time:</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Extension Isolated Shield Ready
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">Chọn Trang Web Lừa Đảo Để Thử Nghiệm Lá Chắn:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {targets.map((t) => (
              <button
                key={t.url}
                onClick={() => {
                  setTargetUrl(t.url);
                  setBypassed(false);
                  addToast('warning', 'Đang Tải Trang Web Mục Tiêu', `Lá chắn Extension đang quét ${t.url}...`);
                }}
                className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                  targetUrl === t.url
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shadow DOM Extension Shield Live Simulator */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-white font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Màn Hình Mô Phỏng Khung Cảnh Báo Trực Tiếp Từ Chrome Extension:</span>
          </span>
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-normal"
          >
            ← Về Trang Chủ
          </button>
        </h3>

        <ShadowDOMExtensionShield
          targetUrl={targetUrl}
          isThreat={true}
          onReturnSafety={() => {
            addToast('success', 'Đã An Toàn!', 'Đã rời khỏi trang web lừa đảo và quay lại trang chủ an toàn.');
            onNavigate('/');
          }}
          onBypass={() => {
            setBypassed(true);
            addToast('warning', 'Đã Bỏ Qua Cảnh Báo', 'Hãy cẩn trọng tuyệt đối không nhập mật khẩu hoặc OTP.');
          }}
        />
      </div>

    </div>
  );
};
