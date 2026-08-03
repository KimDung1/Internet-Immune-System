import type { ThreatResult, ConsequenceOutput, SimulationStep } from '@iis/core'
import { geminiService } from '../services/gemini.service.js'
import { modelConfig } from '../config/gemini.config.js'

const consequenceSchema = {
  type: 'OBJECT',
  required: ['steps', 'potential_loss', 'closing_message'],
  properties: {
    steps: {
      type: 'ARRAY',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'OBJECT',
        required: ['step', 'title', 'description', 'timestamp_label', 'severity'],
        properties: {
          step: { type: 'NUMBER', enum: [1, 2, 3] },
          title: { type: 'STRING', maxLength: 60 },
          description: { type: 'STRING', maxLength: 150 },
          timestamp_label: { type: 'STRING' },
          severity: { type: 'STRING', enum: ['medium', 'high', 'critical'] },
        },
      },
    },
    potential_loss: { type: 'STRING' },
    closing_message: { type: 'STRING', maxLength: 100 },
  },
}

export class SimulationAgent {
  async executeConsequence(scanResult: ThreatResult, scanId: string): Promise<ConsequenceOutput> {
    const prompt = `
Generate a realistic consequence simulation for this confirmed threat.

Classification: ${scanResult.classification}
Risk Score: ${scanResult.riskScore}/100
URL: ${scanResult.geminiExplanation}

Red Flags Detected:
${scanResult.redFlags.map((f) => `- [${f.severity}] ${f.label}: ${f.description}`).join('\n')}

Create a visceral 3-step consequence timeline showing what WOULD happen if the user had not been protected.
Step 1: The Trap (T+0:00)
Step 2: The Harvest (T+seconds)
Step 3: The Damage (T+minutes/hours)

Format potential_loss in Vietnamese VNĐ (e.g., "50.000.000 VND").
End closing_message with an empowering, hopeful tone.
Respond ONLY with valid JSON matching the schema.
    `.trim()

    const fallbackSteps: SimulationStep[] = [
      {
        step: 1,
        title: 'Bạn nhấp vào đường link giả mạo',
        description: 'Trang web thu thập thông tin tài khoản của bạn ngay khi bạn bấm đăng nhập.',
        timestampLabel: 'T+0:00',
        severity: 'medium',
      },
      {
        step: 2,
        title: 'Thông tin bị đánh cắp tức thì',
        description: 'Mật khẩu và mã OTP gửi tới máy chủ kẻ tấn công trong vài giây.',
        timestampLabel: 'T+4 giây',
        severity: 'critical',
      },
      {
        step: 3,
        title: 'Thiệt hại tài chính xảy ra',
        description: 'Tài khoản của bạn bị truy cập và thực hiện chuyển tiền trái phép.',
        timestampLabel: 'T+3 phút',
        severity: 'critical',
      },
    ]

    const fallback: ConsequenceOutput = {
      simulationId: `sim_${crypto.randomUUID().slice(0, 8)}`,
      scanId,
      steps: fallbackSteps,
      potentialLoss: '50.000.000 VND',
      closingMessage: 'Hệ miễn dịch của bạn đã ngăn chặn điều này. Bạn vừa bảo vệ tài sản an toàn.',
      createdAt: new Date().toISOString(),
    }

    try {
      const raw = await geminiService.generateContent<any>(prompt, {
        model: modelConfig.pro,
        temperature: 0.6,
        responseSchema: consequenceSchema,
        fallbackObject: {
          steps: fallbackSteps,
          potential_loss: fallback.potentialLoss,
          closing_message: fallback.closingMessage,
        },
      })

      const steps: SimulationStep[] = (raw.steps || fallbackSteps).map((s: any, idx: number) => ({
        step: (idx + 1) as 1 | 2 | 3,
        title: (s.title || '').slice(0, 60),
        description: (s.description || '').slice(0, 150),
        timestampLabel: s.timestamp_label || `T+${idx * 2}m`,
        severity: s.severity || 'critical',
      }))

      return {
        simulationId: `sim_${crypto.randomUUID().slice(0, 8)}`,
        scanId,
        steps: steps.length === 3 ? steps : fallbackSteps,
        potentialLoss: raw.potential_loss || fallback.potentialLoss,
        closingMessage: (raw.closing_message || fallback.closingMessage).slice(0, 100),
        createdAt: new Date().toISOString(),
      }
    } catch {
      return fallback
    }
  }
}

export const simulationAgent = new SimulationAgent()
