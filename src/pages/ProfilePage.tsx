/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, getAntibodyRank, ALL_BADGES, subscribeUserProfile } from '../lib/storage';
import { UserProfile, UserSettings } from '../types';
import { User, Award, ShieldCheck, Lock, Globe, ArrowLeft, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, addToast }) => {
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [settings, setSettings] = useState<UserSettings>(user.settings);
  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeUserProfile((updated) => {
      setUser(updated);
      setSettings(updated.settings);
    });
    return () => unsubscribe();
  }, []);

  const rank = getAntibodyRank(user.trustScore);

  const handleSaveSettings = () => {
    const updated = updateUserProfile({
      settings,
    });
    setUser(updated);
    addToast('success', 'Đã Lưu Cài Đặt Bảo Vệ', 'Cấu hình hệ miễn dịch đã được cập nhật thành công.');
  };

  const handleAddTrustedDomain = () => {
    if (!newDomain.trim()) return;
    const domain = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!settings.trustedDomains.includes(domain)) {
      setSettings({
        ...settings,
        trustedDomains: [...settings.trustedDomains, domain],
      });
      setNewDomain('');
    }
  };

  const handleRemoveTrustedDomain = (domain: string) => {
    setSettings({
      ...settings,
      trustedDomains: settings.trustedDomains.filter((d) => d !== domain),
    });
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
                Hồ Sơ & Kháng Thể Cá Nhân (User Profile)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded">
                Level {rank.level}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Chỉ Số Miễn Dịch Số · Bộ Sưu Tập Huy Hiệu Kháng Thể · Cấu Hình Lá Chắn Tự Động
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/vaccination')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-mono font-bold"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Thẻ Vắc-xin Số</span>
        </button>
      </div>

      {user.uid === 'guest' && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-cyan-200 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <strong className="text-white font-bold block">BẠN ĐANG TRUY CẬP CHẾ ĐỘ KHÁCH (CHƯA ĐĂNG NHẬP)</strong>
              <span className="text-slate-300">Đăng nhập tài khoản Firebase ở nút góc trên màn hình để đồng bộ chỉ số và chứng chỉ kháng thể lên Cloud Database.</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile & Rank Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0D1527] to-[#111A30] border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        
        {/* User Info */}
        <div className="flex items-center gap-4 md:col-span-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-2xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] flex-shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl text-white">{user.displayName}</h2>
            <p className="text-xs font-mono text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 font-mono text-xs">
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                Lv.{rank.level} {rank.title}
              </span>
              <span className="text-slate-500">Mã Chứng Nhận: {user.vaccineHash}</span>
            </div>
          </div>
        </div>

        {/* Trust Score Gauge Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Điểm Miễn Dịch (Trust Score)</span>
          <div className="font-display font-black text-4xl text-cyan-400">
            {user.trustScore}<span className="text-xs text-slate-500 font-bold">/100</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 my-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000"
              style={{ width: `${user.trustScore}%` }}
            />
          </div>
        </div>

      </div>

      {/* Badges Collection Gallery */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <span>Bộ Sưu Tập Huy Hiệu Kháng Thể Số ({user.badges.length}/{ALL_BADGES.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = user.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all space-y-2 ${
                  isUnlocked
                    ? 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white'
                    : 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{badge.icon}</span>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Đã Mở Khóa
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <Lock className="w-3 h-3" /> Chưa Đạt
                    </span>
                  )}
                </div>

                <h3 className={`font-bold text-sm ${isUnlocked ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
                <p className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                  Điều kiện: {badge.requirement}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protection Settings Form */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>Cài Đặt Cấu Hình Lá Chắn AI</span>
          </h2>
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Cài Đặt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Toggles */}
          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <p className="font-bold text-white">Tự Động Chặn Web Lừa Đảo (Auto-Block)</p>
                <p className="text-slate-500 text-[11px]">Thay thế giao diện web nguy hiểm bằng lá chắn Shield ngay lập tức.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoBlock}
                onChange={(e) => setSettings({ ...settings, autoBlock: e.target.checked })}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <p className="font-bold text-white">Bảo Vệ Real-time Chrome Extension</p>
                <p className="text-slate-500 text-[11px]">Lá chắn ngầm quét liên tục trình duyệt.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.realtimeExtensionShield}
                onChange={(e) => setSettings({ ...settings, realtimeExtensionShield: e.target.checked })}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="font-bold text-white">Độ Nhạy Phân Tích (Sensitivity):</label>
              <select
                value={settings.sensitivity}
                onChange={(e) => setSettings({ ...settings, sensitivity: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="strict">Strict (Nghiêm ngặt - Cảnh báo cả dấu hiệu nhỏ nhất)</option>
                <option value="balanced">Balanced (Cân bằng - Khuyên dùng)</option>
                <option value="lenient">Lenient (Nhiều dung sai - Chỉ chặn rủi ro critical)</option>
              </select>
            </div>
          </div>

          {/* Trusted Domains Whitelist Editor */}
          <div className="space-y-3">
            <label className="font-bold text-xs font-mono text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Danh Sách Tên Miền Tin Cậy (Whitelist):</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. tinte.vn"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddTrustedDomain}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {settings.trustedDomains.map((domain) => (
                <span
                  key={domain}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300"
                >
                  <span>{domain}</span>
                  <button
                    onClick={() => handleRemoveTrustedDomain(domain)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
