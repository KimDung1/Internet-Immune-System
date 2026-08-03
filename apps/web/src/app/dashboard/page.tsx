'use client'

import React, { useEffect, useState } from 'react'
import { Card, AIOrb, RiskBadge } from '@iis/ui'
import { useAuth } from '@/context/AuthContext'
import { API_BASE_URL } from '@/lib/api-client'

export default function DashboardPage() {
  const { userProfile } = useAuth()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    let isMounted = true
    fetch(`${API_BASE_URL}/v1/users/me/history`)
      .then((res) => res.json())
      .then((body) => {
        if (isMounted) setHistory(body.data || [])
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            HỆ THỐNG ĐANG BẢO VỆ
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-2 mb-2">
            Xin chào, {userProfile?.displayName || 'Người Dùng Kháng Thể'}
          </h1>
          <p className="text-sm text-slate-400">
            Hệ miễn dịch số của bạn đang hoạt động liên tục để chặn mối đe dọa.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <AIOrb state="protected" trustScore={userProfile?.trustScore || 87} size={130} />
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="cyber">
          <p className="text-xs font-mono text-slate-400 uppercase mb-1">ĐIỂM KHÁNG THỂ</p>
          <p className="text-3xl font-bold text-cyan-400">{userProfile?.trustScore || 87}/100</p>
          <p className="text-xs text-slate-400 mt-2">Cấp độ {userProfile?.antibodyLevel || 5}: Bảo vệ nâng cao</p>
        </Card>

        <Card variant="cyber">
          <p className="text-xs font-mono text-slate-400 uppercase mb-1">TỔNG LẦN PHÂN TÍCH</p>
          <p className="text-3xl font-bold text-slate-100">{userProfile?.totalScans || 24}</p>
          <p className="text-xs text-slate-400 mt-2">Scan tự động & thủ công</p>
        </Card>

        <Card variant="cyber">
          <p className="text-xs font-mono text-slate-400 uppercase mb-1">MỐI ĐE DỌA ĐÃ CHẶN</p>
          <p className="text-3xl font-bold text-rose-400">{userProfile?.threatsBlocked || 6}</p>
          <p className="text-xs text-slate-400 mt-2">Phishing & Malware blocked</p>
        </Card>

        <Card variant="cyber">
          <p className="text-xs font-mono text-slate-400 uppercase mb-1">HUY HIỆU ĐẠT ĐƯỢC</p>
          <p className="text-3xl font-bold text-emerald-400">{userProfile?.badges?.length || 2}</p>
          <p className="text-xs text-slate-400 mt-2">Phishing Shield, Early Adopter</p>
        </Card>
      </div>

      {/* Recent Scans Stream */}
      <Card variant="cyber" className="p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-6">Lịch Sử Phân Tích Gần Đây</h2>
        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            Chưa có lịch sử phân tích. Hãy thực hiện lượt scan đầu tiên tại trang Phân Tích.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((scan, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">{scan.inputValue}</span>
                </div>
                <RiskBadge classification={scan.classification} riskScore={scan.riskScore} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
