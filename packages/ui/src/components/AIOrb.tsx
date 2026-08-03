

export interface AIOrbProps {
  state?: 'idle' | 'scanning' | 'threat' | 'protected'
  trustScore?: number
  size?: number
  className?: string
}

export function AIOrb({
  state = 'idle',
  trustScore = 50,
  size = 200,
  className = '',
}: AIOrbProps): JSX.Element {
  const colors = {
    idle: { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)' },
    scanning: { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' },
    threat: { primary: '#EF4444', glow: 'rgba(239, 68, 68, 0.6)' },
    protected: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.5)' },
  }

  const activeColor = colors[state]

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`AI Immune Orb state: ${state}, trust score: ${trustScore}`}
    >
      {/* Glow Aura */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-60"
        style={{ backgroundColor: activeColor.glow }}
      />

      {/* Cybernetic Core SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="relative z-10 overflow-visible"
      >
        {/* Outer Rotating Shield Ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={activeColor.primary}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className={state === 'scanning' ? 'animate-spin origin-center duration-3000' : ''}
          opacity="0.8"
        />

        {/* Inner Pulse Circle */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke={activeColor.primary}
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Center Glowing Core */}
        <circle
          cx="50"
          cy="50"
          r="20"
          fill={activeColor.primary}
          opacity="0.85"
          className="animate-pulse"
        />

        {/* Score Text */}
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fill="#0B0F19"
          fontSize="11"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          {trustScore}
        </text>
      </svg>
    </div>
  )
}
