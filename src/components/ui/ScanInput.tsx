/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InputType } from '../../types';
import { sanitizePII } from '../../lib/sanitizer';
import { Link, FileText, Mail, Lock, ShieldCheck, Zap, Clipboard, Eye, EyeOff, Phone, CreditCard } from 'lucide-react';

interface ScanInputProps {
  onScan: (content: string, type: InputType, contextHint?: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const ScanInput: React.FC<ScanInputProps> = ({
  onScan,
  isLoading = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<InputType>('url');
  const [inputText, setInputText] = useState('');
  const [contextHint, setContextHint] = useState('');
  const [showPiiPreview, setShowPiiPreview] = useState(false);

  const piiInfo = sanitizePII(inputText);

  const sampleInputs: Record<string, { label: string; value: string; hint: string }[]> = {
    url: [
      {
        label: '🌐 Fake VCB Login',
        value: 'http://vietcombank-secure-login.ph/dang-nhap',
        hint: 'SMS gửi từ số lạ báo tài khoản bị khóa',
      },
      {
        label: '✅ Báo VTV Tin Tức',
        value: 'https://vtv.vn/xa-hoi/canh-bao-chuyen-nham-tien-de-lua-dao-cac-thu-thuat-moi-2026.htm',
        hint: 'Tin tức báo chí chính thống',
      },
      {
        label: '⚠️ Sàn Crypto 300%',
        value: 'http://nhantien-online-fast.tk/trade',
        hint: 'Nhóm Telegram cam kết lợi nhuận',
      },
    ],
    phone: [
      {
        label: '📞 SĐT Mạo Danh CA',
        value: '0901829102',
        hint: 'Gọi đe dọa vi phạm giao thông / liên quan vụ án',
      },
      {
        label: '📞 SĐT Shipper Giả',
        value: '0938921029',
        hint: 'Gửi link yêu cầu trả cọc đơn hàng chưa đặt',
      },
    ],
    bank: [
      {
        label: '🏦 STK Lừa Cọc 1039829102',
        value: 'STK 1039829102 - MB Bank (Tên: NGUYEN VAN HUNG)',
        hint: 'Mạo danh công an yêu cầu nạp tiền xác minh',
      },
      {
        label: '🏦 STK Giả Danh 1903829101',
        value: 'STK 1903829101 - Vietcombank',
        hint: 'Chuyển tiền mua hàng qua mạng rồi chặn Zalo',
      },
    ],
    text: [
      {
        label: '💬 SMS Khóa TK 50Tr',
        value: '[Techbank]: Tai khoan 0901234567 vua bi khoi tao lenh rut 50.000.000 VND tai Ha Noi. Truy cap ngay http://techbank-verify.net/xacthuc de huy.',
        hint: 'SMS brandname giả mạo chứa SĐT cá nhân',
      },
      {
        label: '💬 Giả Danh Cảnh Sát',
        value: 'Tôi là Đại úy Nguyễn Văn Hùng từ Cục A05. Yêu cầu chuyển 30.000.000 VNĐ vào STK 1039829102 để xác minh.',
        hint: 'Đe dọa pháp luật & đòi chuyển tiền gấp',
      },
    ],
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
      }
    } catch (e) {
      console.warn('Clipboard read error:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onScan(inputText, activeTab, contextHint);
    }
  };

  return (
    <div className={`w-full bg-[#080C16] border border-slate-800 rounded-lg p-4 font-sans ${className}`}>
      
      {/* Input Mode Tabs & PII Status */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 flex-wrap gap-2 font-mono">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'url'
                ? 'bg-cyan-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>URL / LINK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'phone'
                ? 'bg-cyan-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>SỐ ĐIỆN THOẠI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'bank'
                ? 'bg-cyan-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>STK NGÂN HÀNG</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-cyan-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SMS / EMAIL</span>
          </button>
        </div>

        {/* PII Redaction Indicator */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
            <Lock className="w-3 h-3" />
            <span>PII MASKING ACTIVE</span>
          </span>
          {piiInfo.redactedCount > 0 && (
            <button
              type="button"
              onClick={() => setShowPiiPreview(!showPiiPreview)}
              className="flex items-center gap-1 text-amber-400 hover:underline"
            >
              {showPiiPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>ĐÃ ẨN {piiInfo.redactedCount} PII</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="space-y-2.5 font-mono">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeTab === 'url'
                ? 'Dán đường link (URL) cần kiểm tra (ví dụ: http://vietcombank-secure-login.ph)...'
                : activeTab === 'phone'
                ? 'Nhập số điện thoại gọi/nhắn tin nghi ngờ (ví dụ: 0901829102)...'
                : activeTab === 'bank'
                ? 'Nhập số tài khoản ngân hàng cần tra cứu tín nhiệm (ví dụ: STK 1039829102 - MB Bank)...'
                : 'Dán nội dung tin nhắn SMS, Zalo hoặc Email cần kiểm tra...'
            }
            rows={3}
            maxLength={4000}
            className="w-full bg-[#04070D] border border-slate-800 rounded p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono resize-none"
          />

          {/* Counter & Paste */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 text-[10px] text-slate-500">
            <span>{inputText.length}/4000</span>
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              <Clipboard className="w-3 h-3" />
              <span>Dán</span>
            </button>
          </div>
        </div>

        {/* PII Preview Box */}
        {showPiiPreview && piiInfo.redactedCount > 0 && (
          <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
            <div className="font-bold text-amber-400 mb-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VĂN BẢN ĐÃ LỌC PII GỬI TỚI GEMINI AI:</span>
            </div>
            <p className="line-clamp-2 italic opacity-90">{piiInfo.sanitizedText}</p>
          </div>
        )}

        {/* Context Hint Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={contextHint}
            onChange={(e) => setContextHint(e.target.value)}
            placeholder="Ghi chú ngữ cảnh (VD: Nhận từ số điện thoại lạ tự xưng công an...)"
            className="flex-1 bg-[#04070D] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Sample presets & CTA Button */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap text-xs">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 text-[11px]">MẪU THỬ:</span>
            {(sampleInputs[activeTab] || sampleInputs.url).map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputText(sample.value);
                  setContextHint(sample.hint);
                }}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-[11px]"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`flex items-center gap-1.5 px-5 py-2 rounded font-mono font-bold text-xs transition-all ${
              !inputText.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-500 text-black hover:bg-cyan-400 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin text-black" />
                <span>ĐANG PHÂN TÍCH...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>QUÉT NGAY (DETECT)</span>
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  );
};
