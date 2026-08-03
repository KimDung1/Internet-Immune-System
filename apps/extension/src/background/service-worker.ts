import type { ThreatResult } from '@iis/core'

console.log('[IIS Extension] Service Worker Initialized')

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    try {
      const res = await fetch('http://localhost:8080/v1/scans/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'url', contentData: tab.url, url: tab.url }),
      })

      if (res.ok) {
        const body = await res.json()
        const threatResult: ThreatResult = body.data

        if (threatResult && threatResult.actionRecommendation === 'BLOCK') {
          console.warn('[IIS Extension] High Threat Detected! Triggering DOM Shield Overlay on tab:', tabId)
          chrome.tabs.sendMessage(tabId, {
            type: 'IIS_BLOCK_THREAT',
            payload: threatResult,
          }).catch(() => {})
        }
      }
    } catch (err) {
      console.error('[IIS Extension] Real-time scan background check failed:', err)
    }
  }
})
