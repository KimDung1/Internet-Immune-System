/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getScanHistory } from '../lib/storage';
import { auth, getUserScansFromFirestore } from '../lib/firebase';
import { ThreatCard } from '../components/ui/ThreatCard';
import { ExplainModal } from '../components/ui/ExplainModal';
import { TheaterModeModal } from '../components/ui/TheaterModeModal';
import { ScanResult, ClassificationType } from '../types';
import { History, Search, Download, ArrowLeft, Filter, RefreshCw } from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, addToast }) => {
  const [history, setHistory] = useState<ScanResult[]>(getScanHistory());
  const [search, setSearch] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [explainScan, setExplainScan] = useState<ScanResult | null>(null);
  const [simulateScan, setSimulateScan] = useState<ScanResult | null>(null);
  const [loadingDb, setLoadingDb] = useState(false);

  useEffect(() => {
    const fetchDbHistory = async () => {
      const u = auth.currentUser;
      if (u) {
        setLoadingDb(true);
        const remoteScans = await getUserScansFromFirestore(u.uid);
        if (remoteScans.length > 0) {
          setHistory(remoteScans);
        }
        setLoadingDb(false);
      }
    };
    fetchDbHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchClass = classificationFilter === 'all' || item.classification === classificationFilter;
    const matchSearch =
      item.sanitizedValue.toLowerCase().includes(search.toLowerCase()) ||
      item.geminiExplanation.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSearch;
  });

  const handleExportData = () => {
    const jsonStr = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iis_scan_history_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Đã Tải Xuất Dữ Liệu', 'Lịch sử quét đã được tải về dưới dạng JSON.');
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
                Lịch Sử Phân Tích & Bảo Vệ (Scan History)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded">
                Total: {history.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tra Cứu Lại Tất Cả Kết Quả Phân Tích Mối Đe Dọa & Bằng Chứng AI
            </p>
          </div>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Xuất Dữ Liệu JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm URL, nội dung, hoặc từ khóa giải thích..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 text-[11px]">Phân Loại:</span>
          {['all', 'safe', 'phishing', 'scam', 'malware', 'suspicious'].map((c) => (
            <button
              key={c}
              onClick={() => setClassificationFilter(c)}
              className={`px-2.5 py-1 rounded-lg border uppercase ${
                classificationFilter === c
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {c === 'all' ? 'Tất Cả' : c}
            </button>
          ))}
        </div>
      </div>

      {/* History Feed List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111827] border border-slate-800 text-slate-500 space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">Chưa tìm thấy lịch sử phù hợp.</p>
          </div>
        ) : (
          filteredHistory.map((scan) => (
            <ThreatCard
              key={scan.scanId}
              scan={scan}
              onExplain={(s) => setExplainScan(s)}
              onSimulate={(s) => setSimulateScan(s)}
              onBlock={(s) => addToast('success', 'Đã Vô Hiệu Hóa Trang Web', `URL ${s.sanitizedValue} đã bị chặn.`)}
            />
          ))
        )}
      </div>

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
