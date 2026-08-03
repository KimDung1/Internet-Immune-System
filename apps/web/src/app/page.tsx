'use client'

import React from 'react'
import { AIOrb, ScanInput } from '@iis/ui'
import { FeatureShowcase } from '@/components/FeatureShowcase'

export default function HomePage() {
  const handleScan = (value: string) => {
    console.log('[HomePage] Initiating scan for:', value)
    window.location.href = `/scan?query=${encodeURIComponent(value)}`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Animated Cyber Shield Orb */}
        <div className="mb-8">
          <AIOrb state="idle" trustScore={87} size={180} />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight max-w-4xl leading-tight mb-6">
          Hệ Miễn Dịch <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">AI Kích Hoạt</span> Bảo Vệ Bạn Khỏi Lừa Đảo
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
          Phát hiện các trang web giả mạo, tin nhắn lừa đảo và mô phỏng hậu quả tài chính trong thời gian thực bằng Google Gemini AI.
        </p>

        {/* Interactive Scan Input */}
        <div className="w-full max-w-2xl mb-12">
          <ScanInput onScan={handleScan} />
        </div>

        {/* Live Protection Counter */}
        <div className="flex items-center gap-8 text-xs font-mono text-slate-400 border border-slate-800/80 rounded-2xl px-6 py-3 backdrop-blur-md bg-slate-900/40">
          <div>
            <span className="text-cyan-400 font-bold">84.920</span> Mối Đe Dọa Đã Chặn
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div>
            <span className="text-emerald-400 font-bold">99.8%</span> Độ Chính Xác AI
          </div>
        </div>
      </section>

      {/* 5 AI Modes Feature Showcase */}
      <FeatureShowcase />
    </div>
  )
}
