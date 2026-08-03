'use client'

import React from 'react'
import { Card, RiskBadge } from '@iis/ui'

const modes = [
  {
    mode: 'Detect',
    title: 'Phát Hiện Siêu Tốc',
    description: 'Kiểm tra URL, DOM, và nội dung bằng Gemini 2.5 Flash trong < 1.5 giây với 3 tầng tra cứu.',
    badge: 'phishing' as const,
  },
  {
    mode: 'Simulate',
    title: 'Mô Phỏng Hậu Quả',
    description: 'Tái hiện 3 bước tấn công thực tế (T+0, T+4s, T+3m) để giúp người dùng cảm nhận rủi ro.',
    badge: 'scam' as const,
  },
  {
    mode: 'Explain',
    title: 'Giải Thích Thông Minh',
    description: 'Chỉ ra TẠI SAO nguy hiểm bằng tiếng Việt bình dân, không chứa thuật ngữ kỹ thuật phức tạp.',
    badge: 'suspicious' as const,
  },
  {
    mode: 'Train',
    title: 'Luyện Tập Kháng Thể',
    description: 'Tạo tình huống lừa đảo giả lập thích ứng theo độ khó để tăng điểm Trust Score.',
    badge: 'safe' as const,
  },
  {
    mode: 'Protect',
    title: 'Bảo Vệ Nền Thời Gian Thực',
    description: 'Extension Chrome chặn ngay lập tức các trang web lừa đảo đạt điểm rủi ro ≥ 85.',
    badge: 'malware' as const,
  },
]

export function FeatureShowcase() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4 tracking-tight">
          5 Chế Độ Bảo Vệ <span className="text-cyan-400">Toàn Diện</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Không phải chatbot thông thường — đây là một AI Experience chủ động bảo vệ bạn 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modes.map((item) => (
          <Card key={item.mode} variant="cyber" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  MODE: {item.mode}
                </span>
                <RiskBadge classification={item.badge} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
