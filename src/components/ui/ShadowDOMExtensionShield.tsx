/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Zap, Lock, RefreshCw, X, Eye } from 'lucide-react';

interface ShadowDOMExtensionShieldProps {
  targetUrl?: string;
  isThreat?: boolean;
  onBypass?: () => void;
  onReturnSafety?: () => void;
}

export const ShadowDOMExtensionShield: React.FC<ShadowDOMExtensionShieldProps> = ({
  targetUrl = 'http://vietcombank-secure-login.ph/dang-nhap',
  isThreat = true,
  onBypass,
  onReturnSafety,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shieldActive, setShieldActive] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !shieldActive) return;

    const host = containerRef.current;
    
    // Safely retrieve or attach shadowRoot (prevents DOMException: Shadow root already exists)
    let shadowRoot: ShadowRoot | HTMLElement = host.shadowRoot as ShadowRoot;
    if (!shadowRoot && host.attachShadow) {
      try {
        shadowRoot = host.attachShadow({ mode: 'open' });
      } catch (e) {
        shadowRoot = host;
      }
    }
    if (!shadowRoot) shadowRoot = host;

    // Clear old children inside shadowRoot
    while (shadowRoot.firstChild) {
      shadowRoot.removeChild(shadowRoot.firstChild);
    }

    // Encapsulated Isolated CSS rules (guaranteed zero leakage with host page)
    const style = document.createElement('style');
    style.textContent = `
      :host {
        all: initial !important;
        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      }
      .shield-overlay {
        position: relative !important;
        width: 100% !important;
        min-height: 380px !important;
        z-index: 50 !important;
        background: rgba(11, 17, 32, 0.98) !important;
        backdrop-filter: blur(12px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 24px !important;
        color: #ffffff !important;
        box-sizing: border-box !important;
        border-radius: 12px !important;
      }
      .shield-card {
        position: relative !important;
        background: #0F172A !important;
        border: 2px solid #EF4444 !important;
        border-radius: 16px !important;
        padding: 28px !important;
        max-width: 580px !important;
        width: 100% !important;
        box-shadow: 0 0 50px rgba(239, 68, 68, 0.35) !important;
        text-align: center !important;
      }
      .shield-header {
        color: #EF4444 !important;
        font-size: 20px !important;
        font-weight: 800 !important;
        margin-bottom: 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        line-height: 1.3 !important;
      }
      .shield-badge {
        background: rgba(239, 68, 68, 0.2) !important;
        border: 1px solid rgba(239, 68, 68, 0.5) !important;
        color: #F87171 !important;
        padding: 4px 12px !important;
        border-radius: 9999px !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        letter-spacing: 1px !important;
        display: inline-block !important;
      }
      .shield-url {
        background: #070D19 !important;
        border: 1px solid #334155 !important;
        padding: 10px 14px !important;
        border-radius: 10px !important;
        font-family: monospace !important;
        font-size: 13px !important;
        color: #22D3EE !important;
        word-break: break-all !important;
        margin-bottom: 16px !important;
      }
      .shield-desc {
        color: #CBD5E1 !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
        margin-bottom: 24px !important;
        background: rgba(15, 23, 42, 0.6) !important;
        padding: 12px !important;
        border-radius: 8px !important;
        border-left: 3px solid #EF4444 !important;
        text-align: left !important;
      }
      .shield-btn-primary {
        background: #22D3EE !important;
        color: #000000 !important;
        border: none !important;
        padding: 14px 24px !important;
        border-radius: 12px !important;
        font-size: 14px !important;
        font-weight: 800 !important;
        cursor: pointer !important;
        width: 100% !important;
        margin-bottom: 12px !important;
        box-shadow: 0 0 25px rgba(34, 211, 238, 0.4) !important;
        transition: all 0.2s !important;
      }
      .shield-btn-primary:hover {
        background: #06B6D4 !important;
        transform: translateY(-1px) !important;
      }
      .shield-btn-secondary {
        background: rgba(239, 68, 68, 0.15) !important;
        color: #F87171 !important;
        border: 1px solid rgba(239, 68, 68, 0.4) !important;
        padding: 10px 16px !important;
        border-radius: 10px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        width: 100% !important;
      }
      .shield-btn-secondary:hover {
        background: rgba(239, 68, 68, 0.25) !important;
      }
    `;

    // DOM Shield Card Element inside Shadow Root
    const overlay = document.createElement('div');
    overlay.className = 'shield-overlay';

    overlay.innerHTML = `
      <div class="shield-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div class="shield-badge">⚡ CHROME EXTENSION MANIFEST V3 SHIELD</div>
          <button id="btn-top-home" style="background: rgba(34, 211, 238, 0.15); border: 1px solid rgba(34, 211, 238, 0.5); color: #22D3EE; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">
            ← TRỞ VỀ TRANG CHỦ
          </button>
        </div>
        <div class="shield-header">
          🚫 CẢNH BÁO LÁ CHẮN: TRANG WEB LỪA ĐẢO ĐÃ BỊ CHẶN
        </div>
        <div class="shield-url">${targetUrl}</div>
        <div class="shield-desc">
          Lá chắn AI tự động phát hiện liên kết này chứa mã độc / giả mạo thương hiệu nhằm đánh cắp tài khoản ngân hàng và OTP của bạn. Truy cập đã bị cách ly an toàn.
        </div>
        <button id="btn-return-safety" class="shield-btn-primary">
          🛡️ QUAY VỀ TRANG CHỦ AN TOÀN NGAY (KHUYÊN DÙNG)
        </button>
        <button id="btn-bypass-risk" class="shield-btn-secondary">
          ⚠️ Bỏ Qua Cảnh Báo & Tiếp Tục Truy Cập Khấu Trừ Bảo Vệ
        </button>
      </div>
    `;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(overlay);

    // Event listeners
    const btnSafety = shadowRoot.querySelector('#btn-return-safety');
    const btnBypass = shadowRoot.querySelector('#btn-bypass-risk');
    const btnTopHome = shadowRoot.querySelector('#btn-top-home');

    if (btnTopHome) {
      btnTopHome.addEventListener('click', () => {
        setShieldActive(false);
        onReturnSafety?.();
      });
    }

    if (btnSafety) {
      btnSafety.addEventListener('click', () => {
        setShieldActive(false);
        onReturnSafety?.();
      });
    }

    if (btnBypass) {
      btnBypass.addEventListener('click', () => {
        setShieldActive(false);
        onBypass?.();
      });
    }
  }, [targetUrl, isThreat, shieldActive, onBypass, onReturnSafety]);

  return (
    <div className="relative border border-slate-800 rounded-2xl p-4 bg-slate-950 text-slate-300 space-y-4">
      
      {/* Demo Controls Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span className="font-bold text-rose-400">Lá Chắn Giả Lập Chrome Extension Shadow DOM</span>
        </div>
        <div className="flex items-center gap-2">
          {onReturnSafety && (
            <button
              onClick={onReturnSafety}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
            >
              ← Quay Về Trang Chủ
            </button>
          )}
          <button
            onClick={() => setShieldActive(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-all font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Kích Hoạt Lại Lá Chắn</span>
          </button>
        </div>
      </div>

      {/* Target Site Simulated View */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070D19] min-h-[380px]">
        
        {/* Isolated Shadow DOM host element */}
        <div ref={containerRef} id="iis-dom-shield-root" className={shieldActive ? 'block' : 'hidden'} />

        {/* Mock Simulated Page when Bypassed or Shield Inactive */}
        {!shieldActive && (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 font-mono shadow-lg">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0 animate-bounce" />
                <div>
                  <p className="font-bold text-rose-300 text-sm">🔴 BẠN ĐANG TRUY CẬP TRANG WEB NGUY CƠ LỪA ĐẢO CẤP ĐỘ CAO</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">{targetUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShieldActive(true)}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" /> BẬT LẠI LÁ CHẮN
                </button>
                {onReturnSafety && (
                  <button
                    onClick={onReturnSafety}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-all"
                  >
                    ⬅ QUAY VỀ AN TOÀN
                  </button>
                )}
              </div>
            </div>

            {/* Fake Mock Content of the target page so it's never white/blank */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 space-y-4 max-w-md mx-auto shadow-2xl border border-slate-300 opacity-90">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                  VCB
                </div>
                <h2 className="font-bold text-lg text-emerald-800">CỔNG XÁC THỰC TÀI KHOẢN KHÓA</h2>
                <p className="text-xs text-slate-500">Mô phỏng trang giao diện giả mạo ngân hàng</p>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Tên đăng nhập / Số điện thoại:</label>
                  <input type="text" disabled placeholder="090XXXXXXX" className="w-full p-2 border rounded bg-slate-100 text-slate-500" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Mật khẩu VCB Digibank:</label>
                  <input type="password" disabled placeholder="••••••••" className="w-full p-2 border rounded bg-slate-100 text-slate-500" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Mã OTP gửi về điện thoại:</label>
                  <input type="text" disabled placeholder="123456" className="w-full p-2 border rounded bg-slate-100 text-slate-500" />
                </div>
                <div className="p-2 bg-rose-100 border border-rose-300 rounded text-rose-800 text-[11px] font-mono font-bold text-center">
                  ⛔ CẢNH BÁO KHÔNG NHẬP THÔNG TIN TẠI ĐÂY!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
