import type { ThreatResult } from '@iis/core'

console.log('Internet Immune System Browser Extension Background Worker Initialized')

export function handleTabNavigation(url: string): ThreatResult | null {
  console.log('Analyzing URL:', url)
  return null
}
