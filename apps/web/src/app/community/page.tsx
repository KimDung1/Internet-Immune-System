'use client'

import React, { useEffect, useState } from 'react'
import { Card, Button, RiskBadge } from '@iis/ui'
import { API_BASE_URL } from '@/lib/api-client'

export default function CommunityPage() {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchReports = async (isMounted = true) => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/reports`)
      if (res.ok && isMounted) {
        const body = await res.json()
        setReports(body.data || [])
      }
    } catch (err) {
      console.error('[CommunityPage] Fetch failed:', err)
    } finally {
      if (isMounted) setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    fetchReports(isMounted)
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    setIsSubmitting(true)

    try {
      const res = await fetch(`${API_BASE_URL}/v1/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, url }),
      })
      if (res.ok) {
        setDescription('')
        setUrl('')
        fetchReports(true)
      }
    } catch (err) {
      console.error('[CommunityPage] Report failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">Cộng Đồng Kháng Thể Số</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Mạng lưới báo cáo đe dọa trực tiếp từ người dùng Việt Nam. Gemini AI lọc spam và chuẩn hóa blacklist trong thời gian thực.
        </p>
      </div>

      {/* Report Submission Form */}
      <Card variant="cyber" className="p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Gửi Báo Cáo Lừa Đảo Mới</h2>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <input
            type="text"
            placeholder="Đường link nghi ngờ (nếu có)..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
          />
          <textarea
            rows={3}
            placeholder="Mô tả hành vi lừa đảo hoặc dấu hiệu đáng ngờ bạn phát hiện..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
          />
          <div className="flex justify-end">
            <Button variant="cyber" isLoading={isSubmitting} disabled={!description.trim()}>
              Gửi Báo Cáo Cộng Đồng
            </Button>
          </div>
        </form>
      </Card>

      {/* Live Community Feed */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-6">Báo Cáo Mới Nhất ({reports.length})</h2>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500 font-mono">Đang tải luồng báo cáo...</div>
        ) : (
          <div className="space-y-4">
            {reports.map((item, idx) => (
              <Card key={idx} variant="glass" className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    DOMAIN: {item.analysis?.domain || item.url || 'N/A'}
                  </span>
                  <RiskBadge classification={item.status === 'rejected' ? 'safe' : 'phishing'} />
                </div>
                <p className="text-sm text-slate-200 mb-3">{item.description}</p>
                <p className="text-xs text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  🤖 AI Summary: {item.analysis?.summary || 'Đã ghi nhận báo cáo.'}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
