# 🧬 COMPONENT LIBRARY — Internet Immune System
### Version: 1.0.0 | Design Source: [DesignFreeze.md](../DesignFreeze.md) | Stack: React + TypeScript + Framer Motion + Tailwind

> Tất cả components tuân theo **Design System Freeze-1.0.0**.
> Location: `packages/ui/src/components/`

---

## Design Tokens Reference

```ts
// packages/ui/src/tokens.ts
export const tokens = {
  color: {
    bgBase:      '#0B1120',
    surface100:  '#111827',
    surface200:  '#1F2937',
    surface300:  '#374151',
    primary:     '#06B6D4',
    primaryAlt:  '#00E5FF',
    danger:      '#EF4444',
    warning:     '#F59E0B',
    success:     '#10B981',
    dangerGlow:  'rgba(239,68,68,0.4)',
    primaryGlow: 'rgba(6,182,212,0.4)',
    successGlow: 'rgba(16,185,129,0.4)',
  },
  glow: {
    primary: '0 0 12px rgba(6,182,212,0.4)',
    danger:  '0 0 12px rgba(239,68,68,0.4)',
    success: '0 0 12px rgba(16,185,129,0.4)',
  },
  radius: {
    sm:   '4px',
    md:   '8px',
    lg:   '16px',
    full: '9999px',
  },
  font: {
    sans:    'Inter, sans-serif',
    display: "'Space Grotesk', sans-serif",
  },
  motion: {
    scanRadar:       { duration: 2,   ease: 'linear',     repeat: Infinity },
    immuneResponse:  { duration: 0.3, ease: 'easeOut' },
    pageTransition:  { duration: 0.2, ease: 'easeInOut' },
    particleDissolve:{ duration: 0.6, ease: 'easeOut' },
    hudPulse:        { duration: 3,   ease: 'easeInOut',  repeat: Infinity },
    theaterFadeIn:   { duration: 0.8, ease: 'easeIn' },
    badgeBurst:      { duration: 0.4, type: 'spring', stiffness: 400 },
  },
} as const
```

---

---

## 01 · AI Orb

> **"Hệ miễn dịch đang thở"** — Visualization trung tâm, thể hiện trạng thái AI.

### Preview
```
        ┌─────────────────────┐
        │  ░░░░░░░░░░░░░░░░░  │
        │  ░░  ╭─────────╮  ░ │  ← outer pulse ring
        │  ░  │  ╭─────╮  │  ░ │  ← inner ring (gradient)
        │  ░  │  │  76  │  │  ░ │  ← score (Space Grotesk)
        │  ░  │  ╰─────╯  │  ░ │
        │  ░  ╰─────────╯  ░  │
        │  ░░░░░░░░░░░░░░░░░  │
        │    Immunity Score   │
        └─────────────────────┘
```

### Props
```ts
// packages/ui/src/components/AIOrb/AIOrb.tsx
interface AIOrbProps {
  /** Score 0-100. Controls ring fill percentage */
  score: number
  /** Visual state controls color scheme and animation speed */
  state?: 'idle' | 'scanning' | 'threat' | 'protected'
  /** Ring diameter in pixels. Default: 280 */
  size?: number
  /** Show score number in center. Default: true */
  showScore?: boolean
  /** Show "Immunity Score" label below. Default: true */
  showLabel?: boolean
  /** Called when orb is clicked */
  onClick?: () => void
  /** Additional Tailwind classes */
  className?: string
}
```

### State Machine
```ts
type OrbState = {
  idle:      { ringColor: '#10B981→#06B6D4', pulseSpeed: 3,   glowColor: primaryGlow }
  scanning:  { ringColor: '#06B6D4→#00E5FF', pulseSpeed: 0.8, glowColor: primaryGlow, radarActive: true }
  threat:    { ringColor: '#EF4444→#DC2626', pulseSpeed: 0.3, glowColor: dangerGlow,  shake: true }
  protected: { ringColor: '#10B981→#06B6D4', pulseSpeed: 3,   glowColor: successGlow }
}
```

### Implementation
```tsx
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export function AIOrb({
  score, state = 'idle', size = 280, showScore = true, showLabel = true, onClick, className
}: AIOrbProps) {
  const controls = useAnimation()
  const circumference = Math.PI * (size - 16) // stroke-width: 8, so r = size/2 - 8
  const fillOffset = circumference - (score / 100) * circumference

  const stateConfig = {
    idle:      { stroke: 'url(#gradient-idle)',    filter: 'url(#glow-primary)' },
    scanning:  { stroke: 'url(#gradient-scan)',    filter: 'url(#glow-primary)' },
    threat:    { stroke: 'url(#gradient-threat)',  filter: 'url(#glow-danger)'  },
    protected: { stroke: 'url(#gradient-protect)', filter: 'url(#glow-success)' },
  }

  const pulseVariants = {
    idle:      { scale: [1, 1.04, 1], opacity: [0.15, 0.35, 0.15], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
    scanning:  { scale: [1, 1.1,  1], opacity: [0.2,  0.5,  0.2],  transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } },
    threat:    { scale: [1, 1.15, 1], opacity: [0.3,  0.7,  0.3],  transition: { duration: 0.3, repeat: Infinity, ease: 'easeOut' } },
    protected: { scale: [1, 1.03, 1], opacity: [0.1,  0.3,  0.1],  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  }

  const shakeVariants = state === 'threat' ? {
    x: [0, -2, 2, -2, 2, 0], transition: { duration: 0.3 }
  } : {}

  return (
    <div
      className={`relative flex flex-col items-center gap-3 ${className}`}
      role="img"
      aria-label={`Immunity score: ${score} out of 100. Status: ${state}`}
    >
      {/* Outer pulse ring */}
      <motion.div
        className="absolute rounded-full border border-primary/20"
        style={{ width: size + 40, height: size + 40, top: -20, left: -20 }}
        animate={pulseVariants[state]}
      />

      {/* SVG Ring */}
      <motion.div animate={shakeVariants}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="presentation"
          focusable="false"
        >
          <defs>
            <linearGradient id="gradient-idle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="gradient-threat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <filter id="glow-primary">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-danger">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Track circle */}
          <circle
            cx={size / 2} cy={size / 2} r={size / 2 - 8}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
          />

          {/* Progress arc */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={size / 2 - 8}
            fill="none"
            stroke={stateConfig[state].stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            filter={stateConfig[state].filter}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: fillOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          />
        </svg>

        {/* Score text overlay */}
        {showScore && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="font-display text-5xl font-bold text-white tabular-nums"
              key={score}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {score}
            </motion.span>
            <span className="text-xs text-white/40 mt-1">/100</span>
          </div>
        )}
      </motion.div>

      {showLabel && (
        <p className="text-sm text-white/50 tracking-wide">Immunity Score</p>
      )}
    </div>
  )
}
```

### Animation Spec
| Trigger | Animation | Duration | Easing |
|---|---|---|---|
| Mount | Ring fill reveal | 1000ms | `easeOut` |
| `score` change | Ring reflow | 600ms | `easeInOut` |
| `state = 'idle'` | Outer pulse, 3s cycle | ∞ | `easeInOut` |
| `state = 'scanning'` | Fast pulse 0.8s, radar spin | ∞ | `easeInOut` |
| `state = 'threat'` | Red shake 0.3s | 300ms | `easeOut` |
| `state = 'protected'` | Slow gentle pulse | ∞ | `easeInOut` |
| `prefers-reduced-motion` | All animations disabled | — | — |

### Accessibility
```tsx
// ARIA: role="img" + aria-label describe score and status
// Keyboard: onClick handler focusable via tabIndex={0} + onKeyDown Enter/Space
// Color: Not color-only (state also changes shape/speed)
// Screen reader: "Immunity score: 76 out of 100. Status: protected"
```

### Responsive
| Breakpoint | Size | Changes |
|---|---|---|
| Mobile (<640px) | 160px | Reduced outer pulse ring |
| Tablet (640-1023px) | 220px | — |
| Desktop (≥1024px) | 280px | Default |

---

---

## 02 · Threat Card

> Hiển thị kết quả phân tích mối đe dọa — glassmorphism card với glowing border.

### Props
```ts
// packages/ui/src/components/ThreatCard/ThreatCard.tsx
interface ThreatCardProps {
  /** Scan result data */
  scan: {
    id: string
    url?: string
    content?: string
    classification: 'safe' | 'suspicious' | 'phishing' | 'malware' | 'scam'
    riskScore: number          // 0-100
    confidence: number         // 0-1
    redFlags: RedFlag[]
    timestamp: Date
  }
  /** Layout variant */
  variant?: 'full' | 'compact' | 'inline'
  /** Show action buttons (Block / Simulate / Explain) */
  showActions?: boolean
  /** Called when "Simulate" is clicked */
  onSimulate?: (scanId: string) => void
  /** Called when "Explain" is clicked */
  onExplain?: (scanId: string) => void
  /** Called when "Block" is clicked */
  onBlock?: (scanId: string) => void
}

interface RedFlag {
  id: string
  label: string        // e.g. "Fake Domain"
  severity: 'low' | 'medium' | 'high' | 'critical'
  description?: string
}
```

### State
```ts
type ThreatCardState = {
  isExpanded: boolean          // show/hide red flag details
  isBlocking: boolean          // loading state for block action
  isBlockConfirmed: boolean    // after successful block
}
```

### Implementation
```tsx
const classificationConfig = {
  safe:       { bg: 'bg-success/10',  border: 'border-success/30',  glow: '--glow-success', label: 'SAFE ✓',      textColor: 'text-success'  },
  suspicious: { bg: 'bg-warning/10',  border: 'border-warning/30',  glow: '--glow-warning', label: 'SUSPICIOUS',  textColor: 'text-warning'  },
  phishing:   { bg: 'bg-danger/10',   border: 'border-danger/30',   glow: '--glow-danger',  label: 'PHISHING',    textColor: 'text-danger'   },
  malware:    { bg: 'bg-danger/10',   border: 'border-danger/30',   glow: '--glow-danger',  label: 'MALWARE',     textColor: 'text-danger'   },
  scam:       { bg: 'bg-danger/10',   border: 'border-danger/30',   glow: '--glow-danger',  label: 'SCAM',        textColor: 'text-danger'   },
}

export function ThreatCard({ scan, variant = 'full', showActions = true, onSimulate, onExplain, onBlock }: ThreatCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = classificationConfig[scan.classification]
  const isThreat = scan.classification !== 'safe'

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-md
        ${config.bg} ${config.border}
        bg-[#111827]/80
      `}
      style={{ boxShadow: `var(${config.glow})` }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      layout
    >
      {/* Immune Response flash — only on threat */}
      {isThreat && (
        <motion.div
          className="absolute inset-0 bg-danger/10 rounded-2xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      )}

      {/* Left severity bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl`}
        style={{ backgroundColor: isThreat ? '#EF4444' : '#10B981' }}
      />

      <div className="p-5 pl-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* URL/Content preview */}
            <p className="font-mono text-sm text-white/60 truncate">
              {scan.url || scan.content?.slice(0, 80) + '...'}
            </p>
            <p className="text-caption text-white/30 mt-1">
              {formatRelativeTime(scan.timestamp)}
            </p>
          </div>

          {/* Classification badge */}
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold tracking-wider
            border whitespace-nowrap ${config.border} ${config.textColor}
          `}>
            {config.label}
          </span>
        </div>

        {/* Risk score */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isThreat ? 'bg-danger' : 'bg-success'}`}
              initial={{ width: 0 }}
              animate={{ width: `${scan.riskScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <span className={`font-display text-2xl font-bold tabular-nums ${config.textColor}`}>
            {scan.riskScore}
          </span>
        </div>

        {/* Red flags */}
        {isThreat && scan.redFlags.length > 0 && (
          <div className="mb-4">
            <button
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-2"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={`flags-${scan.id}`}
            >
              <span>{scan.redFlags.length} Red Flags detected</span>
              <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>↓</motion.span>
            </button>

            <motion.div
              id={`flags-${scan.id}`}
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-1">
                {scan.redFlags.map(flag => (
                  <span
                    key={flag.id}
                    className="px-2.5 py-1 rounded-lg text-xs bg-danger/10 border border-danger/20 text-danger/90"
                    title={flag.description}
                  >
                    🚩 {flag.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Action buttons */}
        {showActions && isThreat && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onBlock?.(scan.id)}
              className="flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-medium bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 transition-all focus:outline-none focus:ring-2 focus:ring-danger/50"
              aria-label="Block this site"
            >
              🚫 Block
            </button>
            <button
              onClick={() => onSimulate?.(scan.id)}
              className="flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              aria-label="Simulate what would happen"
            >
              🎭 Simulate
            </button>
            <button
              onClick={() => onExplain?.(scan.id)}
              className="flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Explain why this is dangerous"
            >
              📖 Explain
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
```

### Animation Spec
| Trigger | Animation | Duration |
|---|---|---|
| Mount | Slide up + fade in | 300ms `easeOut` |
| Threat detected | Red flash overlay dissolve | 300ms `easeOut` |
| Expand red flags | Height expand + opacity | 250ms `easeInOut` |
| Score bar | Width fill | 800ms `easeOut` + 200ms delay |

### Accessibility
- `aria-expanded` on red flags toggle
- `aria-label` on all action buttons (not just icons)
- Focus rings: 2px, matches card accent color
- Keyboard: all buttons Tab-accessible

### Responsive
| Breakpoint | Changes |
|---|---|
| Mobile | Action buttons stack vertically, full width |
| Tablet | Action buttons in 2-column grid |
| Desktop | Action buttons inline row |

---

---

## 03 · Timeline

> Consequence Theater — animated sequential reveal của 3 steps hậu quả.

### Props
```ts
interface TimelineProps {
  steps: TimelineStep[]
  /** Auto-play reveal with delays. Default: true */
  autoPlay?: boolean
  /** MS delay between steps. Default: 1500 */
  stepDelay?: number
  /** Callback fired when all steps are revealed */
  onComplete?: () => void
  /** Show potential loss banner after last step */
  potentialLoss?: string   // e.g. "50.000.000 VND"
  /** Closing message after loss banner */
  closingMessage?: string
}

interface TimelineStep {
  id: string
  stepNumber: number       // 1 | 2 | 3
  title: string
  description: string
  icon?: React.ReactNode
  timestamp?: string       // e.g. "T+0:04 seconds"
  severity: 'low' | 'medium' | 'high' | 'critical'
}
```

### Implementation
```tsx
export function Timeline({ steps, autoPlay = true, stepDelay = 1500, onComplete, potentialLoss, closingMessage }: TimelineProps) {
  const [revealedCount, setRevealedCount] = useState(0)
  const [showLoss, setShowLoss] = useState(false)
  const [showClosing, setShowClosing] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    const timers: ReturnType<typeof setTimeout>[] = []

    steps.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setRevealedCount(i + 1)
      }, i * stepDelay))
    })

    if (potentialLoss) {
      timers.push(setTimeout(() => setShowLoss(true), steps.length * stepDelay + 200))
    }
    if (closingMessage) {
      timers.push(setTimeout(() => {
        setShowClosing(true)
        onComplete?.()
      }, steps.length * stepDelay + 1200))
    }

    return () => timers.forEach(clearTimeout)
  }, [autoPlay, stepDelay])

  return (
    <div
      className="flex flex-col gap-6"
      role="region"
      aria-label="Attack consequence timeline"
      aria-live="polite"
    >
      {/* Progress bar */}
      <div className="flex gap-1.5" role="progressbar" aria-valuenow={revealedCount} aria-valuemax={steps.length}>
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 h-0.5 rounded-full bg-white/10 overflow-hidden"
          >
            <motion.div
              className="h-full bg-danger rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < revealedCount ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Step cards — horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col md:flex-row gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            className={`
              flex-1 p-5 rounded-2xl border backdrop-blur-md
              bg-[#111827]/60 border-danger/20
              ${i === 1 ? 'md:scale-105' : ''} // center card slightly larger
            `}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={i < revealedCount
              ? { opacity: 1, y: 0, scale: i === 1 ? 1.05 : 1 }
              : { opacity: 0, y: 24, scale: 0.95 }
            }
            transition={{ duration: 0.5, ease: 'easeOut' }}
            aria-hidden={i >= revealedCount}
          >
            {/* Step number */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full border border-danger/40 flex items-center justify-center
                font-display text-sm font-bold text-danger">
                0{step.stepNumber}
              </span>
              {step.timestamp && (
                <span className="text-xs text-white/30 font-mono">{step.timestamp}</span>
              )}
            </div>

            <h3 className="font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Potential Loss banner */}
      <AnimatePresence>
        {showLoss && potentialLoss && (
          <motion.div
            className="p-5 rounded-2xl border border-danger/30 bg-danger/5 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            role="alert"
            aria-live="assertive"
          >
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Estimated Loss</p>
            <p className="font-display text-4xl font-bold text-danger" style={{ textShadow: '0 0 24px rgba(239,68,68,0.6)' }}>
              {potentialLoss}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closing message */}
      <AnimatePresence>
        {showClosing && closingMessage && (
          <motion.div
            className="p-4 rounded-2xl border border-success/20 bg-success/5 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <p className="text-success font-medium">✦ {closingMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### Animation Spec
| Trigger | Animation | Timing |
|---|---|---|
| Each step reveal | Slide up + fade in | 500ms `easeOut` |
| Delay between steps | Auto-play timeout | 1500ms default |
| Progress bar | ScaleX fill | 400ms `easeOut` |
| Loss banner | Scale + fade | 400ms `easeOut` |
| Closing message | Slide up + fade | 500ms `easeOut` |

### Accessibility
- `role="region"` + `aria-label` on container
- `aria-live="polite"` — screen reader announces steps as revealed
- `aria-hidden` on unrevealed steps
- `role="progressbar"` with `aria-valuenow` / `aria-valuemax`
- `aria-live="assertive"` on loss banner (critical alert)
- `prefers-reduced-motion`: show all steps instantly, no sequential reveal

### Responsive
| Breakpoint | Layout |
|---|---|
| Mobile | Steps stack vertically |
| Desktop (≥768px) | Steps in 3-column horizontal row |

---

---

## 04 · Heatmap

> Biểu đồ hoạt động nguy cơ theo ngày/tuần — như GitHub contributions.

### Props
```ts
interface HeatmapProps {
  /** Array of threat counts per day, last N days */
  data: { date: string; count: number; maxRisk: number }[]
  /** Number of weeks to show. Default: 12 */
  weeks?: number
  /** Color scheme */
  colorScheme?: 'danger' | 'primary'
  /** Called when a cell is hovered/clicked */
  onCellSelect?: (cell: { date: string; count: number }) => void
  /** Show week labels (Mon/Wed/Fri). Default: true */
  showLabels?: boolean
}
```

### Implementation
```tsx
export function Heatmap({ data, weeks = 12, colorScheme = 'danger', onCellSelect, showLabels = true }: HeatmapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const maxCount = Math.max(...data.map(d => d.count), 1)

  const getIntensity = (count: number) => {
    if (count === 0) return 0
    return Math.ceil((count / maxCount) * 4)  // 1-4
  }

  const colorMap = {
    danger:  ['bg-white/5', 'bg-danger/20', 'bg-danger/40', 'bg-danger/60', 'bg-danger'],
    primary: ['bg-white/5', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary'],
  }

  return (
    <div
      className="flex flex-col gap-2"
      role="grid"
      aria-label="Threat activity heatmap"
    >
      {/* Month labels */}
      <div className="flex gap-1 pl-6 text-xs text-white/30">
        {/* Generate month labels based on data */}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        {showLabels && (
          <div className="flex flex-col gap-1 pr-1 text-xs text-white/30 justify-around">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
              <span key={i} className="h-3 leading-3">{d}</span>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="flex gap-1" role="row">
          {Array.from({ length: weeks }, (_, weekIdx) =>
            Array.from({ length: 7 }, (_, dayIdx) => {
              const cellDate = data[weekIdx * 7 + dayIdx]
              const intensity = getIntensity(cellDate?.count ?? 0)
              return (
                <motion.div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`
                    w-3 h-3 rounded-sm cursor-pointer transition-all
                    ${colorMap[colorScheme][intensity]}
                    ${hovered === cellDate?.date ? 'ring-1 ring-white/40 scale-125' : ''}
                  `}
                  onHoverStart={() => setHovered(cellDate?.date ?? null)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => cellDate && onCellSelect?.({ date: cellDate.date, count: cellDate.count })}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIdx * 7 + dayIdx) * 0.004, duration: 0.2 }}
                  role="gridcell"
                  aria-label={cellDate
                    ? `${cellDate.date}: ${cellDate.count} threats`
                    : 'No data'
                  }
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && cellDate && onCellSelect?.({ date: cellDate.date, count: cellDate.count })}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="fixed px-3 py-1.5 rounded-lg bg-surface-100 border border-white/10 text-xs text-white z-50 pointer-events-none"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* date and count */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### Animation Spec
| Trigger | Animation | Detail |
|---|---|---|
| Mount | Cells stagger reveal | 4ms delay per cell |
| Hover | Scale 1.25 + ring | Instant |
| Tooltip | Fade + slide up | 150ms |

### Accessibility
- `role="grid"` / `role="gridcell"` structure
- `aria-label` per cell with date + count
- Keyboard: Tab to focus, Enter to select
- Color: intensity communicated via `aria-label` text, not color-only

### Responsive
| Breakpoint | Changes |
|---|---|
| Mobile | Cell size 10px → 8px, weeks = 8 |
| Desktop | Cell size 12px, weeks = 12 |

---

---

## 05 · Mission Card

> Gamified training card — hiển thị drill/mission với reward system.

### Props
```ts
interface MissionCardProps {
  mission: {
    id: string
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    xpReward: number
    badgeReward?: Badge
    estimatedMinutes: number
    completedAt?: Date       // if completed
    score?: number           // 0-100 if completed
  }
  onStart?: (missionId: string) => void
  variant?: 'card' | 'list-row'
}

interface Badge {
  id: string
  name: string
  icon: string   // emoji or icon name
  color: string  // tailwind color class
}
```

### Implementation (key parts)
```tsx
const difficultyConfig = {
  easy:   { label: 'Easy',   color: 'text-success', bg: 'bg-success/10',   border: 'border-success/20'  },
  medium: { label: 'Medium', color: 'text-warning', bg: 'bg-warning/10',   border: 'border-warning/20'  },
  hard:   { label: 'Hard',   color: 'text-danger',  bg: 'bg-danger/10',    border: 'border-danger/20'   },
}

export function MissionCard({ mission, onStart, variant = 'card' }: MissionCardProps) {
  const isCompleted = !!mission.completedAt
  const cfg = difficultyConfig[mission.difficulty]

  return (
    <motion.div
      className={`
        relative p-5 rounded-2xl border backdrop-blur-md
        bg-[#111827]/80 border-white/8
        ${isCompleted ? 'opacity-70' : 'hover:border-primary/30 hover:shadow-[0_0_12px_rgba(6,182,212,0.1)]'}
        transition-all cursor-pointer
      `}
      whileHover={!isCompleted ? { y: -2, scale: 1.01 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => !isCompleted && onStart?.(mission.id)}
      role="article"
      aria-label={`Mission: ${mission.title}. Difficulty: ${mission.difficulty}. ${isCompleted ? `Completed with score ${mission.score}` : `Earn ${mission.xpReward} XP`}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && !isCompleted && onStart?.(mission.id)}
    >
      {/* Completion overlay */}
      {isCompleted && (
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-success/20 border border-success/30
          flex items-center justify-center text-success text-sm" aria-hidden="true">
          ✓
        </div>
      )}

      {/* Difficulty + time */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.color} border`}>
          {cfg.label}
        </span>
        <span className="text-xs text-white/30">~{mission.estimatedMinutes} min</span>
      </div>

      <h3 className="font-semibold text-white mb-1">{mission.title}</h3>
      <p className="text-sm text-white/50 mb-4">{mission.description}</p>

      {/* Reward row */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-primary">+{mission.xpReward} XP</span>
        {mission.badgeReward && (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${mission.badgeReward.color}`}>
            {mission.badgeReward.icon} {mission.badgeReward.name}
          </span>
        )}

        {/* Score bar if completed */}
        {isCompleted && mission.score !== undefined && (
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: `${mission.score}%` }} />
            </div>
            <span className="text-xs text-success font-bold">{mission.score}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
```

### Animation Spec
| Trigger | Animation | Duration |
|---|---|---|
| Hover | Float up 2px + scale 1.01 | 200ms |
| Click | Scale down 0.98 | 100ms |
| Badge reveal (completed) | Burst scale 1→1.2→1 | 400ms spring |

### Accessibility
- `role="article"` với full `aria-label`
- Keyboard: Tab + Enter to start
- Completed state: aria-label includes score

### Responsive
| Breakpoint | Layout |
|---|---|
| Mobile | Single column, full width |
| Tablet | 2 columns grid |
| Desktop | 3 columns grid |

---

---

## 06 · Navbar

> Side navigation (desktop) + Bottom tab bar (mobile). Always-present HUD indicator.

### Props
```ts
interface NavbarProps {
  /** Current active route */
  activeRoute: string
  /** User info for avatar */
  user: { displayName: string; photoURL?: string; trustScore: number }
  /** HUD state for protection indicator */
  hudState: 'protected' | 'scanning' | 'threat' | 'inactive'
  /** Notification count */
  notificationCount?: number
}

type NavItem = {
  href:  string
  label: string
  icon:  React.ComponentType<{ className?: string }>
  badge?: number
}
```

### Implementation
```tsx
const navItems: NavItem[] = [
  { href: '/dashboard',  label: 'Dashboard',   icon: HomeIcon },
  { href: '/scan',       label: 'Detect',      icon: ScanIcon },
  { href: '/training',   label: 'Vaccination',  icon: ShieldIcon },
  { href: '/community',  label: 'Community',   icon: UsersIcon },
  { href: '/history',    label: 'History',     icon: ClockIcon },
  { href: '/settings',   label: 'Settings',    icon: GearIcon },
]

export function Navbar({ activeRoute, user, hudState, notificationCount }: NavbarProps) {
  const hudColors = {
    protected: { dot: 'bg-success', pulse: 'shadow-[0_0_8px_rgba(16,185,129,0.6)]' },
    scanning:  { dot: 'bg-primary', pulse: 'shadow-[0_0_8px_rgba(6,182,212,0.6)]'  },
    threat:    { dot: 'bg-danger',  pulse: 'shadow-[0_0_12px_rgba(239,68,68,0.8)]' },
    inactive:  { dot: 'bg-white/20', pulse: '' },
  }

  return (
    <>
      {/* ─── DESKTOP: Side Navbar ─────────────────────────── */}
      <nav
        className="hidden md:flex flex-col h-screen w-[220px] fixed left-0 top-0
          bg-[#0D1424]/95 backdrop-blur-xl border-r border-white/5 z-20 py-6 px-3"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">IIS</span>
          </div>
          <span className="font-display font-semibold text-white text-sm">Internet Immune</span>
        </div>

        {/* HUD status pill */}
        <div className={`mx-3 mb-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/5`}>
          <motion.div
            className={`w-2 h-2 rounded-full ${hudColors[hudState].dot} ${hudColors[hudState].pulse}`}
            animate={hudState !== 'inactive' ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ duration: hudState === 'threat' ? 0.3 : 3, repeat: Infinity }}
            aria-hidden="true"
          />
          <span className="text-xs text-white/50 capitalize">{hudState}</span>
        </div>

        {/* Nav items */}
        <ul className="flex flex-col gap-1 flex-1" role="list">
          {navItems.map(item => {
            const isActive = activeRoute === item.href
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    transition-all relative group
                    ${isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"
                      layoutId="active-indicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-danger text-white text-xs min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* User section */}
        <div className="px-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden relative">
              {user.photoURL
                ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                : <span className="flex items-center justify-center h-full text-sm text-primary">
                    {user.displayName[0]}
                  </span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.displayName}</p>
              <p className="text-xs text-primary">Score: {user.trustScore}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE: Bottom Tab Bar ───────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20
          bg-[#0D1424]/95 backdrop-blur-xl border-t border-white/5
          flex items-center justify-around px-2 pb-safe-area-inset-bottom"
        aria-label="Mobile navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {navItems.slice(0, 5).map(item => {
          const isActive = activeRoute === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 py-3 px-3 relative
                ${isActive ? 'text-primary' : 'text-white/40'}
                transition-colors
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full"
                  layoutId="mobile-active"
                />
              )}
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </a>
          )
        })}
      </nav>
    </>
  )
}
```

### Animation Spec
| Trigger | Animation |
|---|---|
| Active route change | `layoutId` spring slide indicator |
| HUD state | Opacity pulse (speed varies by state) |
| Threat state | Fast red pulse + glow |

### Accessibility
- `<nav>` with `aria-label`
- `aria-current="page"` on active link
- Mobile: each tab has `aria-label`
- Skip-to-content link for keyboard users

### Responsive
| Breakpoint | Layout |
|---|---|
| Mobile (<768px) | Bottom tab bar, 5 items |
| Desktop (≥768px) | Left side navbar, 6 items |

---

---

## 07 · Dialog

> Modal / Sheet component — supports Theater Mode full-screen and standard dialogs.

### Props
```ts
interface DialogProps {
  isOpen: boolean
  onClose: () => void
  /** Visual mode */
  variant?: 'default' | 'theater' | 'sheet'
  title?: string
  description?: string
  children: React.ReactNode
  /** Size for default variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Show close button. Default: true */
  showClose?: boolean
  /** Prevent closing by clicking backdrop */
  preventClose?: boolean
}
```

### Implementation
```tsx
export function Dialog({ isOpen, onClose, variant = 'default', title, children, size = 'md', showClose = true, preventClose = false }: DialogProps) {

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !preventClose) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, preventClose])

  // Focus trap
  const dialogRef = useRef<HTMLDivElement>(null)

  const overlayVariants = {
    default: { backgroundColor: 'rgba(0,0,0,0.6)' },
    theater: { backgroundColor: 'rgba(0,0,0,0.85)' },
    sheet:   { backgroundColor: 'rgba(0,0,0,0.5)' },
  }

  const contentVariants = {
    default: {
      hidden: { opacity: 0, scale: 0.95, y: 16 },
      visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
      exit:    { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.15, ease: 'easeIn' } },
    },
    theater: {
      hidden:  { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeIn' } },
      exit:    { opacity: 0, transition: { duration: 0.4 } },
    },
    sheet: {
      hidden:  { opacity: 0, y: '100%' },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
      exit:    { opacity: 0, y: '100%', transition: { duration: 0.25 } },
    },
  }

  const sizeClasses = {
    sm:   'max-w-sm',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-none w-full m-4',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, ...overlayVariants[variant] }}
          exit={{ opacity: 0 }}
          onClick={!preventClose ? onClose : undefined}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            ref={dialogRef}
            className={`
              relative w-full mx-4 rounded-2xl border border-white/8
              bg-[#111827]/95 backdrop-blur-xl overflow-hidden
              ${variant === 'sheet' ? 'fixed bottom-0 left-0 right-0 mx-0 rounded-b-none max-h-[90vh]' : sizeClasses[size]}
            `}
            variants={contentVariants[variant]}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                      text-white/40 hover:text-white hover:bg-white/5 transition-all
                      focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Close dialog"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Animation Spec
| Variant | Entry | Exit |
|---|---|---|
| `default` | Scale + fade 200ms | Scale + fade 150ms |
| `theater` | Fade only 800ms | Fade 400ms |
| `sheet` | Spring slide up | Slide down 250ms |

### Accessibility
- `role="dialog"` + `aria-modal="true"` + `aria-label`
- Focus trap: first focusable element receives focus on open
- Escape key closes (unless `preventClose`)
- Return focus to trigger element on close
- `aria-live="polite"` for dynamic content inside

### Responsive
| Variant | Mobile | Desktop |
|---|---|---|
| `default` | Bottom sheet auto | Center modal |
| `sheet` | Full bottom sheet | Full bottom sheet |
| `theater` | Full screen | Full screen |

---

---

## 08 · Chart

> Two chart types: Risk Trend Line + Threat Donut.

### Props
```ts
interface ChartProps {
  type: 'trend' | 'donut'
  data: ChartData
  className?: string
  height?: number
  /** Show legend. Default: true */
  showLegend?: boolean
  /** Show tooltips on hover. Default: true */
  showTooltip?: boolean
}

type ChartData =
  | { type: 'trend'; points: { date: string; risk: number }[] }
  | { type: 'donut'; segments: { label: string; value: number; color: string }[] }
```

### Implementation
```tsx
// Trend Chart — pure SVG, no external chart lib
export function TrendChart({ data, height = 120 }: { data: { date: string; risk: number }[]; height?: number }) {
  const width = 400  // viewBox units
  const padding = { top: 8, right: 8, bottom: 24, left: 32 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom
  const maxRisk = 100

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * plotW,
    y: padding.top + (1 - d.risk / maxRisk) * plotH,
    ...d,
  }))

  const pathD = points.reduce((acc, pt, i) =>
    i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, ''
  )

  const areaD = `${pathD} L ${points.at(-1)!.x} ${padding.top + plotH} L ${padding.left} ${padding.top + plotH} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full overflow-visible"
      role="img"
      aria-label={`Risk trend chart. Highest: ${Math.max(...data.map(d => d.risk))}, Latest: ${data.at(-1)?.risk}`}
    >
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <motion.path
        d={areaD}
        fill="url(#area-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Data points */}
      {points.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x} cy={pt.y} r="3"
          fill="#06B6D4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 + i * 0.05 }}
        />
      ))}
    </svg>
  )
}
```

### Animation Spec
| Element | Animation | Duration |
|---|---|---|
| Line path | `pathLength` 0→1 | 1200ms `easeInOut` |
| Area fill | Opacity 0→1 | 600ms |
| Data points | Scale 0→1 stagger | 50ms delay each |
| Donut segments | Rotate reveal | 800ms |

### Accessibility
- `role="img"` + descriptive `aria-label`
- Legend items have text labels (not color-only)
- Tooltip values readable by screen reader via `aria-live`

### Responsive
- SVG `viewBox` approach: scales to container width automatically
- Legend wraps on mobile

---

---

## 09 · Loading

> 5 loading variants for different contexts.

### Props
```ts
interface LoadingProps {
  variant: 'radar' | 'pulse' | 'skeleton' | 'theater' | 'dots'
  /** For skeleton: define layout slots */
  skeletonSlots?: ('text' | 'card' | 'circle' | 'image')[]
  /** Custom message */
  message?: string
  /** Size for radar/pulse */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

### Variants Implementation
```tsx
// RADAR — used during scan
function RadarLoading({ size = 'md', message }: { size?: string; message?: string }) {
  const sizes = { sm: 80, md: 140, lg: 200 }
  const s = sizes[size as keyof typeof sizes]

  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-label={message || "Scanning..."}>
      <div className="relative" style={{ width: s, height: s }}>
        {/* Base circle */}
        <div className="absolute inset-0 rounded-full border border-primary/20" />

        {/* 3 expanding rings */}
        {[0, 0.3, 0.6].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
            transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}

        {/* Rotating sweep */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 w-0.5 h-1/2 origin-bottom"
            style={{ background: 'linear-gradient(to top, #06B6D4, transparent)' }}
          />
        </motion.div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
      {message && <p className="text-sm text-white/50 animate-pulse">{message}</p>}
    </div>
  )
}

// SKELETON — for content loading placeholders
function SkeletonLoading({ slots = ['card', 'text', 'text'] }: { slots?: string[] }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading content">
      {slots.map((slot, i) => {
        const slotClasses = {
          text:   'h-4 rounded-md w-3/4',
          card:   'h-32 rounded-2xl w-full',
          circle: 'h-10 w-10 rounded-full flex-shrink-0',
          image:  'h-48 rounded-xl w-full',
        }
        return (
          <motion.div
            key={i}
            className={`bg-white/5 ${slotClasses[slot as keyof typeof slotClasses]}`}
            animate={{ opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
          />
        )
      })}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// DOTS — inline loading
function DotsLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-3" role="status" aria-label={message || 'Processing'}>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      {message && <span className="text-sm text-white/50">{message}</span>}
    </div>
  )
}

// Export unified component
export function Loading({ variant, skeletonSlots, message, size, className }: LoadingProps) {
  return (
    <div className={className}>
      {variant === 'radar'    && <RadarLoading size={size} message={message} />}
      {variant === 'skeleton' && <SkeletonLoading slots={skeletonSlots} />}
      {variant === 'dots'     && <DotsLoading message={message} />}
      {variant === 'pulse'    && <PulseLoading message={message} />}
    </div>
  )
}
```

### Animation Spec
| Variant | Core Animation |
|---|---|
| `radar` | 3 rings expand + fade, sweep rotates 2s |
| `pulse` | Scale breathe 0.95↔1.05, 1.5s |
| `skeleton` | Opacity shimmer 1.5s stagger |
| `dots` | Bounce Y -6px, stagger 120ms |
| `theater` | Full-screen fade + brain spin |

### Accessibility
- All variants: `role="status"` + `aria-label`
- Skeleton: `<span class="sr-only">Loading...</span>`
- `prefers-reduced-motion`: no animation (opacity only)

---

---

## 10 · Button

> 3 variants × 5 states. Supports loading, icons, glow effects.

### Props
```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  /** Pulse animation — used for threat CTAs */
  pulse?: boolean
}
```

### Implementation
```tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, pulse, children, disabled, className, ...props }, ref) => {

  const variantClasses = {
    primary: `
      bg-primary text-black font-semibold
      hover:shadow-[0_0_16px_rgba(6,182,212,0.5)]
      focus:ring-primary/50
    `,
    danger: `
      bg-danger text-white font-semibold
      hover:shadow-[0_0_16px_rgba(239,68,68,0.5)]
      focus:ring-danger/50
      ${pulse ? 'animate-pulse' : ''}
    `,
    ghost: `
      bg-transparent text-primary font-medium
      border border-white/20
      hover:border-primary/40 hover:bg-primary/5
      focus:ring-primary/30
    `,
    success: `
      bg-success/10 text-success font-medium
      border border-success/30
      hover:bg-success/20 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]
      focus:ring-success/50
    `,
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  }

  return (
    <motion.button
      ref={ref}
      className={`
        inline-flex items-center justify-center
        transition-all duration-150 cursor-pointer select-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1120]
        disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  )
})
Button.displayName = 'Button'
```

### States
| State | Visual |
|---|---|
| Default | Solid fill + subtle shadow |
| Hover | Glow box-shadow (12-16px) + scale 1.02 |
| Focus | 2px ring (color matches variant) |
| Active | Scale 0.97 |
| Disabled | 30% opacity, `not-allowed` cursor |
| Loading | Spinner replaces content |

### Accessibility
- `aria-busy` when loading
- `aria-disabled` (not `disabled` alone, to keep in tab order for screen readers)
- Focus ring always visible (color-matched per variant)
- Loading: `sr-only` text "Loading"

### Responsive
- Size `sm` on mobile for tight layouts
- Full-width option: pass `className="w-full"`

---

---

## 11 · Input (ScanInput)

> Primary input component — large textarea với scanning radar ring.

### Props
```ts
interface ScanInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  /** Input mode tabs */
  activeMode?: 'url' | 'text' | 'email'
  onModeChange?: (mode: 'url' | 'text' | 'email') => void
  isScanning?: boolean
  placeholder?: string
  maxLength?: number     // Default: 4000
  autoFocus?: boolean
}
```

### Implementation
```tsx
export function ScanInput({
  value, onChange, onSubmit,
  activeMode = 'url', onModeChange,
  isScanning = false,
  maxLength = 4000,
  autoFocus = false,
}: ScanInputProps) {
  const isNearLimit = value.length > maxLength * 0.95
  const placeholders = {
    url:   'Dán URL nghi ngờ vào đây...',
    text:  'Dán tin nhắn SMS, Zalo, Facebook vào đây...',
    email: 'Dán nội dung email nghi ngờ vào đây...',
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && value.trim()) {
      onSubmit(value)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Mode tabs */}
      <div
        className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit"
        role="tablist"
        aria-label="Input mode"
      >
        {(['url', 'text', 'email'] as const).map(mode => (
          <button
            key={mode}
            role="tab"
            aria-selected={activeMode === mode}
            onClick={() => onModeChange?.(mode)}
            className={`
              px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
              ${activeMode === mode
                ? 'bg-primary text-black shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                : 'text-white/50 hover:text-white'
              }
            `}
          >
            {mode === 'url' ? '🔗 URL' : mode === 'text' ? '💬 Text' : '📧 Email'}
          </button>
        ))}
      </div>

      {/* Textarea container with radar ring */}
      <div className="relative">
        {/* Scanning radar rings */}
        {isScanning && (
          <>
            {[0, 0.4, 0.8].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl border border-primary/30 pointer-events-none"
                animate={{ scale: [1, 1.02, 1.02], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
          </>
        )}

        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={e => {
            const text = e.clipboardData.getData('text')
            if (text.trim()) setTimeout(() => onSubmit(text), 50) // auto-submit on paste (optional)
          }}
          placeholder={placeholders[activeMode]}
          maxLength={maxLength}
          autoFocus={autoFocus}
          rows={5}
          className={`
            w-full px-4 py-3.5 rounded-2xl resize-none
            bg-[#0B1120] text-white placeholder-white/20
            border transition-all duration-200 outline-none
            focus:border-primary focus:shadow-[0_0_0_1px_rgba(6,182,212,0.3)]
            ${isNearLimit ? 'border-warning/40' : 'border-white/10'}
            ${isScanning ? 'border-primary/60' : ''}
          `}
          aria-label={`${activeMode} input for threat analysis`}
          aria-describedby="scan-input-hint scan-char-count"
        />

        {/* Submit button inside textarea */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {/* Char counter */}
          <span
            id="scan-char-count"
            className={`text-xs ${isNearLimit ? 'text-warning' : 'text-white/20'}`}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>

          {/* Submit */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => value.trim() && onSubmit(value)}
            disabled={!value.trim() || isScanning}
            isLoading={isScanning}
            aria-label="Analyze content"
          >
            {isScanning ? '' : '⚡ Analyze'}
          </Button>
        </div>
      </div>

      <p id="scan-input-hint" className="text-xs text-white/25">
        Ctrl+Enter to submit · Supports URLs, phone numbers, messages, emails
      </p>
    </div>
  )
}
```

### States
| State | Border | Shadow |
|---|---|---|
| Default | `rgba(255,255,255,0.1)` | — |
| Focus | `#06B6D4` 1px + glow | `0 0 0 1px rgba(6,182,212,0.3)` |
| Scanning | Cyan border + radar rings | Radar animation |
| Near limit | Warning amber | — |
| Error | Danger red | Red glow |

### Animation Spec
| Trigger | Animation |
|---|---|
| `isScanning = true` | 3 radar rings expand, 2s each offset |
| Focus | Border color transition 200ms |
| Char limit warning | Border color transition 200ms |

### Accessibility
- `aria-label` describes input purpose
- `aria-describedby` → char count + hint text
- `aria-live="polite"` on char counter (updates are announced)
- Keyboard: `Ctrl/Cmd + Enter` submits

### Responsive
- `rows={5}` on desktop, `rows={4}` on mobile
- Submit button: full-width below input on mobile (not inside textarea)

---

---

## 12 · Toast

> Notification system — 4 types, supports threat alerts.

### Props
```ts
interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'threat'
  title: string
  description?: string
  duration?: number       // ms, 0 = persist. Default: 5000
  action?: {
    label: string
    onClick: () => void
  }
  onDismiss: (id: string) => void
}
```

### Implementation
```tsx
const toastConfig = {
  success: { icon: '✓',  bg: 'bg-success/10', border: 'border-success/20', text: 'text-success',  glow: '' },
  error:   { icon: '✕',  bg: 'bg-danger/10',  border: 'border-danger/20',  text: 'text-danger',   glow: '' },
  warning: { icon: '⚠',  bg: 'bg-warning/10', border: 'border-warning/20', text: 'text-warning',  glow: '' },
  threat:  { icon: '⚡', bg: 'bg-danger/15',  border: 'border-danger/40',  text: 'text-danger',   glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
}

export function Toast({ id, type, title, description, duration = 5000, action, onDismiss }: ToastProps) {
  const cfg = toastConfig[type]
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (duration === 0) return
    const start = Date.now()
    const frame = () => {
      const elapsed = Date.now() - start
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(pct)
      if (pct > 0) requestAnimationFrame(frame)
      else onDismiss(id)
    }
    const raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [duration, id, onDismiss])

  return (
    <motion.div
      layout
      className={`
        relative overflow-hidden flex gap-3 p-4 rounded-2xl border
        backdrop-blur-xl min-w-[320px] max-w-[420px]
        ${cfg.bg} ${cfg.border} ${cfg.glow}
        bg-[#111827]/90
      `}
      initial={{ opacity: 0, x: 48, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      role="alert"
      aria-live={type === 'threat' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {/* Icon */}
      <span className={`text-lg flex-shrink-0 ${cfg.text}`} aria-hidden="true">{cfg.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        {description && <p className="text-xs text-white/50 mt-0.5">{description}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className={`text-xs font-medium mt-2 ${cfg.text} hover:underline focus:outline-none focus:underline`}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(id)}
        className="text-white/30 hover:text-white transition-colors flex-shrink-0 text-sm
          focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
        aria-label="Dismiss notification"
      >
        ✕
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5" aria-hidden="true">
          <div
            className={`h-full bg-current ${cfg.text} transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}

// Toast Container
export function ToastContainer({ toasts, onDismiss }: { toasts: ToastProps[]; onDismiss: (id: string) => void }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
```

### Types & Behavior
| Type | `aria-live` | Glow | Auto-dismiss |
|---|---|---|---|
| `success` | polite | — | 5s |
| `error` | polite | — | 7s |
| `warning` | polite | — | 6s |
| `threat` | assertive | Red glow | 0 (persist) |

### Animation Spec
| Trigger | Animation |
|---|---|
| Appear | Spring slide from right, scale up |
| Dismiss | Fade + slide right 200ms |
| Stack | `layout` auto-reflow |
| Progress | rAF countdown |

### Accessibility
- `role="alert"` + `aria-live` per type
- `aria-atomic="true"` — screen reader reads full toast
- `threat` type: `aria-live="assertive"` — interrupts current reading
- Dismiss button: `aria-label="Dismiss notification"`
- Keyboard: Escape key to dismiss focused toast

### Responsive
| Breakpoint | Position |
|---|---|
| Mobile | Bottom center, full width minus 16px margin |
| Desktop | Top right, max-width 420px |

---

---

## 📦 Package Export

```ts
// packages/ui/src/index.ts
export { AIOrb }           from './components/AIOrb/AIOrb'
export { ThreatCard }      from './components/ThreatCard/ThreatCard'
export { Timeline }        from './components/Timeline/Timeline'
export { Heatmap }         from './components/Heatmap/Heatmap'
export { MissionCard }     from './components/MissionCard/MissionCard'
export { Navbar }          from './components/Navbar/Navbar'
export { Dialog }          from './components/Dialog/Dialog'
export { TrendChart }      from './components/Chart/TrendChart'
export { Loading }         from './components/Loading/Loading'
export { Button }          from './components/Button/Button'
export { ScanInput }       from './components/Input/ScanInput'
export { Toast, ToastContainer } from './components/Toast/Toast'
export * from './tokens'
export * from './types'
```

## 🔗 Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "react": "^18.0.0",
    "lucide-react": "^0.400.0"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

## ♿ Global Accessibility Rules

```css
/* packages/ui/src/globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🔗 Tài liệu liên quan

- [DesignFreeze.md](../DesignFreeze.md) — frozen design tokens
- [MotionDesign.md](../docs/05_UI/MotionDesign.md) — animation library
- [UISpecs.md](../docs/05_UI/UISpecs.md) — component states spec
- [MicrointeractionLibrary.md](../docs/05_UI/MicrointeractionLibrary.md)
