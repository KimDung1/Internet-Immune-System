'use client'

import React, { useState } from 'react'
import { Card, Button, AIOrb, ScanInput, RiskBadge } from '@iis/ui'
import type { ThreatResult, ExplanationResult, ConsequenceOutput } from '@iis/core'
import { ExplainModal } from '@/components/ExplainModal'
import { TheaterModeModal } from '@/components/TheaterModeModal'
import { API_BASE_URL } from '@/lib/api-client'

export default function ScanPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [scanResult, setScanResult] = useState<ThreatResult | null>(null)
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null)
  const [simulation, setSimulation] = useState<ConsequenceOutput | null>(null)
  const [isExplainOpen, setIsExplainOpen] = useState(false)
  const [isExplainLoading, setIsExplainLoading] = useState(false)
  const [isSimOpen, setIsSimOpen] = useState(false)
  const [isSimLoading, setIsSimLoading] = useState(false)

  const handleScan = async (value: string) => {
    setIsLoading(true)
    setScanResult(null)
    setExplanation(null)
    setSimulation(null)

    try {
      const isUrl = value.startsWith('http://') || value.startsWith('https://')
      const res = await fetch(`${API_BASE_URL}/v1/scans/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: isUrl ? 'url' : 'text',
          contentData: value,
          url: isUrl ? value : undefined,
        }),
      })

      if (res.ok) {
        const body = await res.json()
        setScanResult(body.data)
      }
    } catch (err) {
      console.error('[ScanPage] Scan request failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplain = async () => {
    if (!scanResult?.scanId) return
    setIsExplainOpen(true)
    setIsExplainLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/v1/scans/${scanResult.scanId}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const body = await res.json()
        setExplanation(body.data)
      }
    } catch (err) {
      console.error('[ScanPage] Explain request failed:', err)
    } finally {
      setIsExplainLoading(false)
    }
  }

  const handleSimulate = async () => {
    if (!scanResult?.scanId) return
    setIsSimOpen(true)
    setIsSimLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/v1/scans/${scanResult.scanId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const body = await res.json()
        setSimulation(body.data)
      }
    } catch (err) {
      console.error('[ScanPage] Simulate request failed:', err)
    } finally {
      setIsSimLoading(false)
    }
  }

  const orbState = isLoading
    ? 'scanning'
    : scanResult
    ? scanResult.riskScore >= 70
      ? 'threat'
      : scanResult.riskScore <= 30
      ? 'protected'
      : 'idle'
    : 'idle'

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <AIOrb state={orbState} trustScore={scanResult?.riskScore || 50} size={150} className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Phân Tích Mối Đe Dọa</h1>
        <p className="text-sm text-slate-400">Dán URL, email hoặc nội dung nghi ngờ để Gemini AI kiểm tra ngay lập tức</p>
      </div>

      <div className="mb-10">
        <ScanInput onScan={handleScan} isLoading={isLoading} />
      </div>

      {scanResult && (
        <Card variant="cyber" className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">KẾT QUẢ PHÂN TÍCH</p>
              <h2 className="text-lg font-bold text-slate-100">{scanResult.inputValue}</h2>
            </div>
            <RiskBadge classification={scanResult.classification} riskScore={scanResult.riskScore} />
          </div>

          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <p className="text-xs font-mono text-cyan-400 mb-1">ĐÁNH GIÁ CỦA GEMINI AI</p>
            <p className="text-sm text-slate-200 leading-relaxed">{scanResult.geminiExplanation}</p>
          </div>

          {scanResult.redFlags?.length > 0 && (
            <div>
              <p className="text-xs font-mono text-slate-400 mb-3 uppercase">Dấu Hiệu Đáng Ngờ ({scanResult.redFlags.length})</p>
              <div className="space-y-2">
                {scanResult.redFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-rose-400">{flag.label}: </span>
                      <span className="text-slate-300">{flag.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="cyber" onClick={handleExplain}>
              Tại Sao Nguy Hiểm?
            </Button>
            {scanResult.classification !== 'safe' && (
              <Button variant="danger" onClick={handleSimulate}>
                Xem Kịch Bản Hậu Quả
              </Button>
            )}
          </div>
        </Card>
      )}

      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        scanResult={scanResult}
        explanation={explanation}
        isLoading={isExplainLoading}
      />

      <TheaterModeModal
        isOpen={isSimOpen}
        onClose={() => setIsSimOpen(false)}
        simulation={simulation}
        isLoading={isSimLoading}
      />
    </div>
  )
}
