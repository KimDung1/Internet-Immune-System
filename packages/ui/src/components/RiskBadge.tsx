

export interface RiskBadgeProps {
  classification: 'safe' | 'suspicious' | 'phishing' | 'malware' | 'scam'
  riskScore?: number
  className?: string
}

export function RiskBadge({
  classification,
  riskScore,
  className = '',
}: RiskBadgeProps): JSX.Element {
  const styles = {
    safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    suspicious: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    phishing: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    malware: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    scam: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  }

  const labels = {
    safe: 'An Toàn',
    suspicious: 'Đáng Ngờ',
    phishing: 'Giả Mạo (Phishing)',
    malware: 'Mã Độc (Malware)',
    scam: 'Lừa Đảo (Scam)',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${styles[classification]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {labels[classification]}
      {typeof riskScore === 'number' ? ` (${riskScore}/100)` : null}
    </span>
  )
}
