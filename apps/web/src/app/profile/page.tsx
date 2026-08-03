'use client'

import React, { useState } from 'react'
import { Card, Button, AIOrb } from '@iis/ui'
import { useAuth } from '@/context/AuthContext'
import { API_BASE_URL } from '@/lib/api-client'

export default function ProfilePage() {
  const { userProfile } = useAuth()
  const [autoBlock, setAutoBlock] = useState(userProfile?.settings?.autoBlock ?? true)
  const [sensitivity, setSensitivity] = useState(userProfile?.settings?.sensitivity || 'balanced')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    try {
      await fetch(`${API_BASE_URL}/v1/users/me/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoBlock, sensitivity }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('[ProfilePage] Save settings failed:', err)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <AIOrb state="protected" trustScore={userProfile?.trustScore || 87} size={120} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-100 mb-1">{userProfile?.displayName || 'Người Dùng Kháng Thể'}</h1>
        <p className="text-sm text-cyan-400 font-mono">{userProfile?.email || 'user@immune-system.vn'}</p>
      </div>

      <Card variant="cyber" className="p-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-800 pb-3">Cấu Hình Bảo Vệ AI</h2>

          {/* Auto Block Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-slate-800/80">
            <div>
              <p className="text-sm font-semibold text-slate-200">Tự Động Chặn Đe Dọa (Auto-Block)</p>
              <p className="text-xs text-slate-400">Tự động chặn các trang web có điểm rủi ro ≥ 85</p>
            </div>
            <button
              onClick={() => setAutoBlock(!autoBlock)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 p-1 flex items-center ${
                autoBlock ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* AI Sensitivity Level */}
          <div className="py-4 border-b border-slate-800/80">
            <p className="text-sm font-semibold text-slate-200 mb-1">Độ Nhạy Phân Tích Gemini AI</p>
            <p className="text-xs text-slate-400 mb-4">Điều chỉnh ngưỡng quét cảnh báo đỏ</p>

            <div className="grid grid-cols-3 gap-3">
              {(['strict', 'balanced', 'lenient'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSensitivity(level)}
                  className={`p-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    sensitivity === level
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {level === 'strict' ? 'Nghiêm Ngặt' : level === 'balanced' ? 'Cân Bằng' : 'Thả Lỏng'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-2">
          {saved ? <span className="text-xs font-mono text-emerald-400 font-bold">✓ Cấu hình đã lưu thành công!</span> : <span />}
          <Button variant="cyber" onClick={handleSave}>
            Lưu Cấu Hình
          </Button>
        </div>
      </Card>
    </div>
  )
}
