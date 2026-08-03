'use client'

import React from 'react'
import { Card, Button, AIOrb } from '@iis/ui'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { signInWithGoogle, isLoading } = useAuth()

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <Card variant="cyber" className="max-w-md w-full text-center flex flex-col items-center p-8">
        <AIOrb state="idle" trustScore={50} size={120} className="mb-6" />

        <h1 className="text-2xl font-bold text-slate-100 mb-2">Đăng Nhập Hệ Miễn Dịch</h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Đăng nhập để theo dõi Điểm Kháng Thể, xem Lịch Sử Phân Tích và nhận Huy Hiệu Bảo Vệ.
        </p>

        <Button
          variant="cyber"
          size="lg"
          className="w-full justify-center"
          isLoading={isLoading}
          onClick={signInWithGoogle}
        >
          Tiếp Tục Với Google
        </Button>

        <p className="text-[11px] text-slate-500 mt-6 leading-normal">
          Bằng việc đăng nhập, bạn đồng ý với Điều Khoản Dịch Vụ và Chính Sách Bảo Mật Quyền Riêng Tư của Internet Immune System.
        </p>
      </Card>
    </div>
  )
}
