import React from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import './globals.css'

export const metadata = {
  title: 'Internet Immune System — AI Defense Engine',
  description: 'Hệ miễn dịch AI bảo vệ người dùng Việt Nam khỏi lừa đảo trực tuyến',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
