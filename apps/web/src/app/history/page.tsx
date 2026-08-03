'use client'

import React, { useEffect, useState } from 'react'
import { Card, RiskBadge } from '@iis/ui'
import { API_BASE_URL } from '@/lib/api-client'

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'phishing' | 'safe'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetch(`${API_BASE_URL}/v1/users/me/history`)
      .then((res) => res.json())
      .then((body) => {
        if (isMounted) setHistory(body.data || [])
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredHistory = history.filter((item) => {
    if (filter === 'phishing') return item.classification !== 'safe'
    if (filter === 'safe') return item.classification === 'safe'
    return true
  })

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Lịch Sử Bảo VỆ</h1>
        <p className="text-sm text-slate-400">Xem lại toàn bộ các lượt scan URL, văn bản và đe dọa đã phát hiện</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        {(['all', 'phishing', 'safe'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase transition-all duration-200 ${
              filter === tab
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab === 'all' ? 'Tất Cả' : tab === 'phishing' ? 'Mối Đe Dọa' : 'An Toàn'}
          </button>
        ))}
      </div>

      {/* History Stream */}
      <Card variant="cyber" className="p-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">Đang tải lịch sử...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">Không tìm thấy lượt scan phù hợp.</div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, idx) => (
              <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-cyan-400 mb-1">{item.timestamp || 'Mới đây'}</p>
                  <p className="text-sm font-bold text-slate-100">{item.inputValue}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.geminiExplanation}</p>
                </div>
                <RiskBadge classification={item.classification} riskScore={item.riskScore} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
