'use client'

import React, { useState } from 'react'
import { Card, Button, AIOrb } from '@iis/ui'
import type { TrainingSession } from '@iis/core'
import { API_BASE_URL } from '@/lib/api-client'

export default function TrainPage() {
  const [session, setSession] = useState<TrainingSession | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<{
    sessionId: string
    score: number
    correctAnswers: number
    totalQuestions: number
    trustScoreDelta: number
    completedAt: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleStartDrill = async () => {
    setIsLoading(true)
    setSession(null)
    setResult(null)
    setAnswers([])
    setCurrentQ(0)

    try {
      const res = await fetch(`${API_BASE_URL}/v1/training/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'medium' }),
      })
      if (res.ok) {
        const body = await res.json()
        setSession(body.data)
      }
    } catch (err) {
      console.error('[TrainPage] Start drill failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectOption = (optionIndex: number) => {
    const nextAnswers = [...answers, optionIndex]
    setAnswers(nextAnswers)

    if (currentQ < 2) {
      setCurrentQ(currentQ + 1)
    } else {
      submitAnswers(nextAnswers)
    }
  }

  const submitAnswers = async (finalAnswers: number[]) => {
    if (!session?.sessionId) return
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/v1/training/sessions/${session.sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAnswers: finalAnswers }),
      })
      if (res.ok) {
        const body = await res.json()
        setResult(body.data)
      }
    } catch (err) {
      console.error('[TrainPage] Submit failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <AIOrb state="protected" trustScore={87} size={140} className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Luyện Tập Kháng Thể</h1>
        <p className="text-sm text-slate-400">Tham gia diễn tập tình huống lừa đảo giả lập để tăng điểm Trust Score</p>
      </div>

      {!session && !result && (
        <Card variant="cyber" className="text-center p-8 max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-slate-100 mb-3">Sẵn Sàng Diễn Tập?</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Gemini AI sẽ tạo ra một tình huống lừa đảo thực tế gồm 3 câu hỏi trắc nghiệm thích ứng.
          </p>
          <Button variant="cyber" size="lg" isLoading={isLoading} onClick={handleStartDrill}>
            Bắt Đầu Luyện Tập (+10 Điểm)
          </Button>
        </Card>
      )}

      {session && !result && (
        <Card variant="cyber" className="p-8 space-y-6">
          {/* Scenario Callout */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              TÌNH HUỐNG GIẢ LẬP — {session.scenarioType}
            </span>
            <p className="text-sm text-slate-200 mt-2 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              "{session.scenarioContent}"
            </p>
          </div>

          {/* Question Render */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400">CÂU HỎI {currentQ + 1}/3</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-4">
              {session.questions[currentQ]?.question}
            </h3>

            <div className="space-y-3">
              {session.questions[currentQ]?.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left p-4 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs sm:text-sm text-slate-200 transition-all duration-200"
                >
                  <span className="font-mono text-cyan-400 font-bold mr-3">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {result && (
        <Card variant="cyber" className="text-center p-8 space-y-6">
          <div className="inline-block p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-3xl font-bold mb-2">
            {result.score}%
          </div>
          <h2 className="text-2xl font-bold text-slate-100">KẾT QUẢ DIỄN TẬP</h2>
          <p className="text-sm text-slate-300">
            Bạn trả lời đúng <span className="text-cyan-400 font-bold">{result.correctAnswers}/3</span> câu hỏi.
            Thưởng <span className="text-emerald-400 font-bold">+{result.trustScoreDelta} Điểm Kháng Thể</span>!
          </p>

          <Button variant="cyber" onClick={handleStartDrill}>
            Luyện Tập Lại
          </Button>
        </Card>
      )}
    </div>
  )
}
