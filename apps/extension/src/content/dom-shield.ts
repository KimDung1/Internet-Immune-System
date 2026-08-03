import type { ThreatResult } from '@iis/core'

console.log('[IIS Extension] DOM Shield Script Injected')

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'IIS_BLOCK_THREAT') {
    const threat: ThreatResult = message.payload
    injectThreatOverlay(threat)
  }
})

function injectThreatOverlay(threat: ThreatResult) {
  if (document.getElementById('iis-dom-shield-root')) return

  const host = document.createElement('div')
  host.id = 'iis-dom-shield-root'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'closed' })

  const container = document.createElement('div')
  container.innerHTML = `
    <style>
      .shield-overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: rgba(11, 15, 25, 0.95);
        backdrop-filter: blur(20px);
        color: #F8FAFC;
        font-family: system-ui, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
      }
      .shield-box {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(239, 68, 68, 0.4);
        border-radius: 1.5rem;
        padding: 2.5rem;
        max-width: 32rem;
        box-shadow: 0 0 50px rgba(239, 68, 68, 0.3);
      }
      .badge {
        background: rgba(239, 68, 68, 0.2);
        color: #EF4444;
        border: 1px solid rgba(239, 68, 68, 0.4);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        display: inline-block;
        margin-bottom: 1rem;
      }
      .title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
      .desc { font-size: 0.875rem; color: #94A3B8; margin-bottom: 1.5rem; line-height: 1.5; }
      .btn {
        background: #06B6D4;
        color: #0B0F19;
        font-weight: 700;
        padding: 0.75rem 1.5rem;
        border-radius: 0.75rem;
        border: none;
        cursor: pointer;
      }
    </style>
    <div class="shield-overlay">
      <div class="shield-box">
        <span class="badge">CẢNH BÁO ĐỎ — ${threat.classification}</span>
        <div class="title">ĐÃ CHẶN TRANG WEB NGUY HIỂM</div>
        <div class="desc">${threat.geminiExplanation}</div>
        <button class="btn" id="iis-leave-btn">Quay Lại An Toàn</button>
      </div>
    </div>
  `

  shadow.appendChild(container)

  const leaveBtn = shadow.getElementById('iis-leave-btn')
  if (leaveBtn) {
    leaveBtn.addEventListener('click', () => {
      window.history.back()
    })
  }
}
