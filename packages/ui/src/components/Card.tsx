import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'cyber'
  children: React.ReactNode
}

export function Card({
  variant = 'glass',
  children,
  className = '',
  ...props
}: CardProps): JSX.Element {
  const baseStyle = 'rounded-2xl p-6 transition-all duration-300'

  const variants = {
    glass: 'backdrop-blur-md bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 shadow-xl shadow-slate-950/50',
    solid: 'bg-slate-900 border border-slate-800 shadow-lg',
    cyber: 'backdrop-blur-xl bg-slate-950/80 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 relative overflow-hidden',
  }

  return (
    <div className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
