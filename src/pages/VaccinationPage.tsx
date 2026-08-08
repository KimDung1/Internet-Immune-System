/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getUserProfile, getAntibodyRank, subscribeUserProfile } from '../lib/storage';
import { ShieldCheck, Award, ArrowLeft, Copy, Check, Download, QrCode } from 'lucide-react';

interface VaccinationPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const VaccinationPage: React.FC<VaccinationPageProps> = ({ onNavigate, addToast }) => {
  const [user, setUser] = useState(getUserProfile());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeUserProfile((updated) => setUser(updated));
    return () => unsubscribe();
  }, []);

  const rank = getAntibodyRank(user.trustScore);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(user.vaccineHash);
    setCopied(true);
    addToast('success', 'Đã Sao Chép Mã Vắc-xin', `Mã ${user.vaccineHash} đã lưu vào bộ nhớ tạm.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
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
                Thẻ Vắc-xin Số Chống Lừa Đảo (Digital Vaccine Pass)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded">
                VALID CERTIFICATE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Chứng Nhận Cấp Độ Kháng Thể Số Chính Thức Từ Internet Immune System Vietnam
            </p>
          </div>
        </div>
      </div>

      {/* Main Digital Vaccine Pass Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0F1E38] to-[#070D19] border-2 border-emerald-500/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.25)] space-y-6">
        
        {/* Holographic Watermark Background */}
        <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
          <ShieldCheck className="w-72 h-72 text-emerald-400" />
        </div>

        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap border-b border-emerald-500/30 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white tracking-wide">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </h2>
              <p className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
                Chứng Nhận Kháng Thể Số · Digital Immunization Certificate
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>HIỆU LỰC BẢO VỆ ACTIVE</span>
          </div>
        </div>

        {/* Pass Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 font-mono">
          
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Họ và Tên Chủ Thẻ:</span>
            <p className="font-bold text-base text-white">{user.displayName}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Cấp Độ Kháng Thể Số:</span>
            <p className="font-bold text-base text-emerald-400">
              Level {rank.level}: {rank.title}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Chỉ Số Miễn Dịch (Trust Score):</span>
            <p className="font-bold text-base text-cyan-400">{user.trustScore}/100 Point</p>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <span className="text-[10px] uppercase text-slate-400">Mã Định Danh Vắc-xin Số (Vaccine Hash):</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                {user.vaccineHash}
              </span>
              <button
                onClick={handleCopyHash}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400">Ngày Cấp Thẻ:</span>
            <p className="text-xs text-slate-300">03/08/2026</p>
          </div>

        </div>

        {/* QR Code & Immunization Scope */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-500/30 relative z-10 items-center">
          
          <div className="sm:col-span-3 space-y-2">
            <h4 className="font-bold text-xs font-mono text-emerald-400 uppercase">
              Phạm Vi Các Biến Chủng Lừa Đảo Đã Được Miễn Dịch:
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                ✓ Phishing Domain Spoofing
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                ✓ Fake Bank SMS Brandname
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                ✓ Deepfake Call AI
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                ✓ Malware APK Installers
              </span>
            </div>
          </div>

          {/* QR Code Graphic */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-black text-center space-y-1">
            <QrCode className="w-16 h-16 text-black" />
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">XÁC MINH QR</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 relative z-10">
          <button
            onClick={() => addToast('success', 'Đã Tải Thẻ Vắc-xin', 'Hình ảnh thẻ vắc-xin số đã được xuất thành công.')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            <Download className="w-4 h-4 fill-black" />
            <span>Tải Thẻ Vắc-xin Số (.PNG)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
