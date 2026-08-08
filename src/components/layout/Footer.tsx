/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, ExternalLink, PhoneCall, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#070D18] border-t border-slate-800 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-display font-bold text-sm text-white">Internet Immune System</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nền tảng AI Experience đa tầng phòng ngự chống lừa đảo trực tuyến tại Việt Nam. Vận hành bởi Google Gemini API.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Hệ Thống Đang Bảo Vệ Real-time</span>
            </div>
          </div>

          {/* Col 2: Core Modes */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider font-mono">5 AI Defence Modes</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => onNavigate('/scan')} className="hover:text-cyan-400 transition-colors">Detect Mode (Phát Hiện)</button></li>
              <li><button onClick={() => onNavigate('/scan')} className="hover:text-cyan-400 transition-colors">Explain Mode (Giải Thích)</button></li>
              <li><button onClick={() => onNavigate('/simulate')} className="hover:text-cyan-400 transition-colors">Simulate Mode (Mô Phỏng Hậu Quả)</button></li>
              <li><button onClick={() => onNavigate('/train')} className="hover:text-cyan-400 transition-colors">Train Mode (Huấn Luyện Kháng Thể)</button></li>
              <li><button onClick={() => onNavigate('/protect')} className="hover:text-cyan-400 transition-colors">Protect Mode (Lá Chắn Realtime)</button></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider font-mono">Tài Nguyên & Liên Kết</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => onNavigate('/community')} className="hover:text-cyan-400 transition-colors">Cổng Báo Cáo Lừa Đảo Cộng Đồng</button></li>
              <li><button onClick={() => onNavigate('/vaccination')} className="hover:text-cyan-400 transition-colors">Chứng Nhận Vắc-xin Số (Vaccine Pass)</button></li>
              <li><button onClick={() => onNavigate('/history')} className="hover:text-cyan-400 transition-colors">Tra Cứu Lịch Sử Quét</button></li>
              <li>
                <a href="https://ncsc.gov.vn" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1">
                  Cục An Toàn Thông Tin (NCSC VN) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Hotlines */}
          <div className="space-y-2">
            <h4 className="font-semibold text-rose-400 uppercase text-[11px] tracking-wider font-mono flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" /> Hotline Khẩn Cấp
            </h4>
            <p className="text-slate-400">Khi bị nghi ngờ mất khoản tiền hoặc bị tấn công:</p>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-rose-400 font-bold">Cục An Ninh Mạng A05:</span> 113 / 069.219.4053
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-cyan-400 font-bold">Vietcombank 24/7:</span> 1800 1218
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© 2026 Internet Immune System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span> <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> <span>for Vietnam Internet Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
