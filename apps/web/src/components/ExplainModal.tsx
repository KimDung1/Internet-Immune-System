'use client'

import React from 'react'
import { Card, Button, RiskBadge } from '@iis/ui'
import type { ThreatResult, ExplanationResult } from '@iis/core'

export interface ExplainModalProps {
  isOpen: boolean
  onClose: () => void
  scanResult: ThreatResult | null
  explanation: ExplanationResult | null
  isLoading?: boolean
}

export function ExplainModal({
  isOpen,
  onClose,
  scanResult,
  explanation,
  isLoading = false,
}: ExplainModalProps): JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                GIẢI THÍCH CHUYÊN SÂU — GEMINI 2.5 PRO
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">Phân Tích Lý Do Nguy Hiểm</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100 font-mono text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400 font-mono">Gemini 2.5 Pro đang phân tích dữ liệu...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Target & Risk Rating */}
              <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-400 truncate max-w-[200px]">
                  {scanResult?.inputValue}
                </span>
                <RiskBadge
                  classification={scanResult?.classification || 'safe'}
                  riskScore={scanResult?.riskScore || 0}
                />
              </div>

              {/* Plain Narrative */}
              <Card variant="cyber" className="p-4 space-y-2">
                <p className="text-xs font-mono text-cyan-400 uppercase">TÓM TẮT DỄ HIỂU</p>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {explanation?.plainNarrative || explanation?.aiNarrative || scanResult?.geminiExplanation}
                </p>
              </Card>

              {/* Red Flags Detail */}
              {scanResult?.redFlags && scanResult.redFlags.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-mono text-slate-400 uppercase">Dấu Hiệu Nhận Biết Chi Tiết</p>
                  <div className="space-y-2">
                    {scanResult.redFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-400">{flag.label}</span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{flag.severity}</span>
                        </div>
                        <p className="text-slate-300 leading-normal">{flag.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safe Action Advice */}
              <div className="bg-cyan-950/30 border border-cyan-500/20 p-4 rounded-xl space-y-2">
                <p className="text-xs font-mono text-cyan-400 uppercase">HÀNH ĐỘNG KHUYÊN DÙNG</p>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {(explanation?.actionSteps || explanation?.whatToDo)?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  )) || (
                    <>
                      <li>Không nhấp vào bất kỳ đường link nào trong thông báo.</li>
                      <li>Liên hệ trực tiếp ngân hàng/tổ chức qua hotline chính thức.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800">
          <Button variant="cyber" className="w-full" onClick={onClose}>
            Đã Hiểu & Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
