import { useState } from 'react'
import { createRoot } from 'react-dom/client'

export function ExtensionPopup() {
  const [isProtected, setIsProtected] = useState(true)

  return (
    <div style={{ padding: '1.25rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: isProtected ? '#10B981' : '#EF4444' }} />
        <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
          {isProtected ? 'HỆ THỐNG ĐANG BẢO VỆ' : 'ĐÃ TẮT BẢO VỆ'}
        </span>
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#06B6D4' }}>87/100</div>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Điểm Kháng Thể An Toàn</div>
      </div>

      <button
        onClick={() => setIsProtected(!isProtected)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          border: 'none',
          backgroundColor: isProtected ? '#1E293B' : '#06B6D4',
          color: isProtected ? '#F8FAFC' : '#0B0F19',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}
      >
        {isProtected ? 'Tắt Bảo Vệ Lớp Nền' : 'Bật Bảo Vệ Lớp Nền'}
      </button>
    </div>
  )
}

const root = createRoot(document.getElementById('popup-root')!)
root.render(<ExtensionPopup />)
