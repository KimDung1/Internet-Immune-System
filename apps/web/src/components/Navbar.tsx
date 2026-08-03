'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@iis/ui'
import { useAuth } from '@/context/AuthContext'

export function Navbar() {
  const { user, userProfile, signInWithGoogle, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/75 border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span className="font-bold text-lg text-slate-100 tracking-tight">
            Internet<span className="text-cyan-400">Immune</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Trang Chủ
          </Link>
          <Link href="/scan" className="hover:text-cyan-400 transition-colors">
            Phân Tích
          </Link>
          <Link href="/train" className="hover:text-cyan-400 transition-colors">
            Luyện Tập
          </Link>
          <Link href="/community" className="hover:text-cyan-400 transition-colors">
            Cộng Đồng
          </Link>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/history" className="hover:text-cyan-400 transition-colors">
            Lịch Sử
          </Link>
          <Link href="/profile" className="hover:text-cyan-400 transition-colors">
            Cá Nhân
          </Link>
          <Link href="/vaccination" className="hover:text-cyan-400 transition-colors">
            Tiêm Chủng
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-200 font-semibold">{userProfile?.displayName || user.email}</p>
                <p className="text-[10px] text-cyan-400 font-mono">Điểm Kháng Thể: {userProfile?.trustScore || 50}/100</p>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                Đăng Xuất
              </Button>
            </div>
          ) : (
            <Button variant="cyber" size="sm" onClick={signInWithGoogle}>
              Đăng Nhập Google
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
