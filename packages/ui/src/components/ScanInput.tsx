'use client'

import React, { useState } from 'react'

export interface ScanInputProps {
  onScan: (value: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function ScanInput({
  onScan,
  isLoading = false,
  placeholder = 'Dán đường link, đoạn văn bản, hoặc email nghi ngờ vào đây...',
  className = '',
}: ScanInputProps): JSX.Element {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onScan(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full px-5 py-4 text-sm bg-slate-950/80 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-xl transition-all duration-300 pr-32"
      />
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="absolute right-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-semibold text-xs rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
      >
        {isLoading ? (
          <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>Phân Tích</span>
        )}
      </button>
    </form>
  )
}
