/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getCommunityReports, addCommunityReport } from '../lib/storage';
import { saveCommunityReportToFirestore, getCommunityReportsFromFirestore } from '../lib/firebase';
import { CommunityReport } from '../types';
import { Users, ShieldAlert, Plus, CheckCircle2, Search, ArrowLeft, Send } from 'lucide-react';

interface CommunityPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate, addToast }) => {
  const [reports, setReports] = useState<CommunityReport[]>(getCommunityReports());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showReportForm, setShowReportForm] = useState(false);

  // Form State
  const [entityType, setEntityType] = useState<CommunityReport['entityType']>('URL');
  const [entityValue, setEntityValue] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchRemote = async () => {
      const remote = await getCommunityReportsFromFirestore();
      if (remote && remote.length > 0) {
        setReports((prev) => {
          const map = new Map();
          [...prev, ...remote].forEach((r) => map.set(r.reportId || r.entityValue, r));
          return Array.from(map.values());
        });
      }
    };
    fetchRemote();
  }, []);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityValue.trim() || !description.trim()) {
      addToast('warning', 'Thiếu Thông Tin', 'Vui lòng điền đầy đủ giá trị và mô tả báo cáo.');
      return;
    }

    const newReport = {
      reporterUid: 'user_v1_local',
      reporterName: 'Lê Kim Dũng',
      entityType,
      entityValue: entityValue.trim(),
      description: description.trim(),
      riskLevel: 'high' as const,
    };

    addCommunityReport(newReport);
    await saveCommunityReportToFirestore(newReport);

    setReports(getCommunityReports());
    setEntityValue('');
    setDescription('');
    setShowReportForm(false);
    addToast('success', '✅ Đã Báo Cáo Thành Công (+3 Điểm Trust Score)', 'Báo cáo của bạn đã được cộng đồng xác minh và đưa vào lá chắn bảo vệ!');
  };

  const filteredReports = reports.filter((r) => {
    const matchType = filterType === 'all' || r.entityType === filterType;
    const matchSearch =
      r.entityValue.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

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
                Cộng Đồng Cảnh Báo Lừa Đảo (Community Feed)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded">
                Verified Shield
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cơ Sở Dữ Liệu Mối Đe Dọa Mới Nhất Được Đóng Góp & Xác Minh Bởi 45.000+ Người Dùng
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Báo Cáo Mối Đe Dọa</span>
        </button>
      </div>

      {/* Community Report Form Modal/Accordion */}
      {showReportForm && (
        <form
          onSubmit={handleCreateReport}
          className="p-6 rounded-2xl bg-[#111827] border border-cyan-500/40 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-fadeIn"
        >
          <div className="flex items-center justify-between text-cyan-400 font-bold font-mono text-sm border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Gửi Báo Cáo Lừa Đảo Mới Cho Cộng Đồng</span>
            </span>
            <span className="text-emerald-400 text-xs">+3 Điểm Trust Score</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Loại Đối Tượng:</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="URL">🌐 Đường Link / URL / Web</option>
                <option value="PHONE">📞 Số Điện Thoại</option>
                <option value="BANK_ACCOUNT">💳 Số Tài Khoản Ngân Hàng</option>
                <option value="EMAIL">📧 Địa Chỉ Email</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-mono text-slate-400">Giá Trị Đối Tượng (URL / SĐT / STK):</label>
              <input
                type="text"
                value={entityValue}
                onChange={(e) => setEntityValue(e.target.value)}
                placeholder="e.g. 0901 829 381 hoặc http://vietcombank-secure-login.ph"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Mô Tả Thủ Đoạn Lừa Đảo:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả cụ thể hành vi lừa đảo (e.g. Giả mạo công an dọa khóa tài khoản đòi nạp tiền...)"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowReportForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>Gửi Báo Cáo</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm URL, SĐT, STK lừa đảo trong cơ sở dữ liệu..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-500 text-[11px]">Lọc:</span>
          {['all', 'URL', 'PHONE', 'BANK_ACCOUNT', 'EMAIL'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg border uppercase ${
                filterType === t
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {t === 'all' ? 'Tất Cả' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Community Reports Feed */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111827] border border-slate-800 text-slate-500">
            Không tìm thấy báo cáo lừa đảo khớp với từ khóa.
          </div>
        ) : (
          filteredReports.map((item) => (
            <div
              key={item.reportId}
              className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold uppercase">
                      {item.entityType}
                    </span>
                    <span className="font-mono text-sm font-bold text-cyan-300">
                      {item.entityValue}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã Xác Minh ({item.verifiedCount} Vote)</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                <span>Người báo cáo: {item.reporterName}</span>
                <span>Thới gian: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
