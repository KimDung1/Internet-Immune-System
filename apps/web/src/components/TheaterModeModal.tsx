'use client'

import React from 'react'
import { Card, Button } from '@iis/ui'
import type { ConsequenceOutput } from '@iis/core'

export interface TheaterModeModalProps {
  isOpen: boolean
  onClose: () => void
  simulation: ConsequenceOutput | null
  isLoading?: boolean
}

export function TheaterModeModal({
  isOpen,
  onClose,
  simulation,
  isLoading = false,
}: TheaterModeModalProps): JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <Card variant="cyber" className="max-w-2xl w-full relative p-8 border-rose-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-lg font-mono"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-950/50 px-3 py-1 rounded-full border border-rose-500/30">
            THEATER MODE — KỊCH BẢN HẬU QUẢ
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-3">Điều Gì Sẽ Xảy Ra Nếu Bạn Nhấp Vào?</h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-mono">Gemini 2.5 Pro đang tái hiện kịch bản tấn công...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 3 Step Timeline */}
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-rose-500/20">
              {simulation?.steps?.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <span className="absolute left-1 top-1 w-5 h-5 rounded-full bg-rose-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                    {step.step}
                  </span>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
                        {step.timestampLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Loss Callout */}
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-rose-400 uppercase">ƯỚC TÍNH THIỆT HẢI TÀI CHÍNH</p>
                <p className="text-xl font-bold text-rose-400">{simulation?.potentialLoss || '50.000.000 VND'}</p>
              </div>
              <span className="text-xs text-slate-400">Rút tiền tự động trong 3 phút</span>
            </div>

            {/* Hopeful Closing Message */}
            <p className="text-xs text-emerald-400 text-center font-medium bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl">
              🛡️ {simulation?.closingMessage || 'Hệ miễn dịch của bạn đã ngăn chặn điều này thành công.'}
            </p>

            <div className="flex justify-end pt-2">
              <Button variant="danger" onClick={onClose}>
                Đóng Kịch Bản
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
