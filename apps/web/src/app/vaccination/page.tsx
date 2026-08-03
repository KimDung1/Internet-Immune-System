'use client'

import React, { useEffect, useState } from 'react'
import { Card, Button, AIOrb } from '@iis/ui'
import { useAuth } from '@/context/AuthContext'
import { API_BASE_URL } from '@/lib/api-client'

export default function VaccinationPage() {
  const { userProfile } = useAuth()
  const [antibodies, setAntibodies] = useState<any[]>([])
  const [isImmunizing, setIsImmunizing] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchAntibodies = async (isMounted = true) => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/vaccine/antibodies`)
      if (res.ok && isMounted) {
        const body = await res.json()
        setAntibodies(body.data || [])
      }
    } catch (err) {
      console.error('[VaccinationPage] Fetch failed:', err)
    }
  }

  useEffect(() => {
    let isMounted = true
    fetchAntibodies(isMounted)
    return () => {
      isMounted = false
    }
  }, [])

  const handleImmunize = async () => {
    setIsImmunizing(true)
    setSuccessMsg('')
    try {
      const res = await fetch(`${API_BASE_URL}/v1/vaccine/immunize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threatPattern: 'Phishing_Banking_OTP_v2' }),
      })
      if (res.ok) {
        setSuccessMsg('Tiêm chủng Kháng Thể Số thành công! Bạn đã được bảo vệ trước mẫu lừa đảo mới.')
        fetchAntibodies(true)
      }
    } catch (err) {
      console.error('[VaccinationPage] Immunization failed:', err)
    } finally {
      setIsImmunizing(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto space-y-10">
      <div className="text-center">
        <AIOrb state="protected" trustScore={userProfile?.trustScore || 87} size={150} className="mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">Tiêm Chủng Kháng Thể Số</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Mạng lưới vắc-xin số toàn cầu tự động tạo mẫu kháng thể bảo vệ bạn trước các đợt tấn công lừa đảo mới nổi.
        </p>
      </div>

      {/* 1-Click Immunization Card */}
      <Card variant="cyber" className="p-8 text-center max-w-xl mx-auto space-y-4">
        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
          VẮC-XIN SỐ MỚI NHẤT DISCOVERED
        </span>
        <h2 className="text-xl font-bold text-slate-100">Cập Nhật Kháng Thể Phishing Banking v2</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tự động nạp mẫu chữ ký lừa đảo giả mạo ngân hàng mới phát hiện trong 24h qua vào Extension Shield của bạn.
        </p>

        {successMsg ? (
          <p className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
            ✓ {successMsg}
          </p>
        ) : (
          <Button variant="cyber" size="lg" isLoading={isImmunizing} onClick={handleImmunize}>
            Tiêm Chủng Ngay (1-Click Immunize)
          </Button>
        )}
      </Card>

      {/* Active Antibody Matrix */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-6">Mẫu Kháng Thể Đã Nạp ({antibodies.length})</h2>

        {antibodies.length === 0 ? (
          <Card variant="glass" className="p-8 text-center text-xs font-mono text-slate-500">
            Chưa có vắc-xin số được nạp. Hãy bấm nút "Tiêm Chủng Ngay" ở trên để kích hoạt kháng thể đầu tiên.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {antibodies.map((item, idx) => (
              <Card key={idx} variant="glass" className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-emerald-400">{item.antibodyCode}</p>
                  <p className="text-sm font-bold text-slate-100 mt-1">{item.threatPattern}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Nạp lúc: {item.immunizedAt}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
                  LEVEL {item.protectionLevel}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
