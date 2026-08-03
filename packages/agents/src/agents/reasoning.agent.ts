import type { ThreatResult } from '@iis/core'
import { geminiService } from '../services/gemini.service.js'
import { modelConfig } from '../config/gemini.config.js'

export interface ExplanationResult {
  aiNarrative: string
  redFlagDetails: {
    flagId: string
    label: string
    explanation: string
    learnMore: string
  }[]
  whatToDo: string[]
  educationalTip: string
  immunityPointsEarned: number
}

const reasonResponseSchema = {
  type: 'OBJECT',
  required: ['ai_narrative', 'red_flag_details', 'what_to_do', 'educational_tip', 'immunity_points_earned'],
  properties: {
    ai_narrative: { type: 'STRING', maxLength: 300 },
    red_flag_details: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        required: ['flag_id', 'label', 'explanation', 'learn_more'],
        properties: {
          flag_id: { type: 'STRING' },
          label: { type: 'STRING' },
          explanation: { type: 'STRING', maxLength: 120 },
          learn_more: { type: 'STRING', maxLength: 100 },
        },
      },
    },
    what_to_do: {
      type: 'ARRAY',
      minItems: 3,
      maxItems: 3,
      items: { type: 'STRING', maxLength: 150 },
    },
    educational_tip: { type: 'STRING', maxLength: 120 },
    immunity_points_earned: { type: 'NUMBER', enum: [5, 10, 15] },
  },
}

export class ReasoningAgent {
  async execute(scanResult: ThreatResult, trustScore: number = 50): Promise<ExplanationResult> {
    const prompt = `
Explain this threat detection result in clear, educational Vietnamese for an everyday user.

Classification: ${scanResult.classification}
Risk Score: ${scanResult.riskScore}/100
Red Flags Count: ${scanResult.redFlags.length}
User Trust Score: ${trustScore}/100

Red Flags:
${scanResult.redFlags.map((f) => `- [${f.severity}] ${f.label}: ${f.description}`).join('\n')}

Explain WHY this is dangerous in simple Vietnamese (Grade 8 reading level).
Provide exactly 3 immediate what_to_do actions, 1 educational_tip, and calculate immunity_points_earned (5, 10, or 15).
Respond ONLY with valid JSON matching the schema.
    `.trim()

    const fallback: ExplanationResult = {
      aiNarrative: 'Nội dung này có dấu hiệu lừa đảo. Hãy thận trọng và xác minh qua kênh chính thức.',
      redFlagDetails: scanResult.redFlags.map((f) => ({
        flagId: f.id,
        label: f.label,
        explanation: f.description,
        learnMore: 'Xác minh qua website/hotline chính thức.',
      })),
      whatToDo: [
        'Không nhấp vào link hoặc tải file từ nguồn này',
        'Liên hệ tổ chức liên quan qua kênh chính thức của họ',
        'Báo cáo cho cộng đồng Internet Immune System',
      ],
      educationalTip: 'Khi nghi ngờ, hãy luôn xác minh qua số điện thoại chính thức.',
      immunityPointsEarned: 5,
    }

    try {
      const raw = await geminiService.generateContent<any>(prompt, {
        model: modelConfig.pro,
        temperature: 0.3,
        responseSchema: reasonResponseSchema,
        fallbackObject: {
          ai_narrative: fallback.aiNarrative,
          red_flag_details: [],
          what_to_do: fallback.whatToDo,
          educational_tip: fallback.educationalTip,
          immunity_points_earned: 5,
        },
      })

      return {
        aiNarrative: (raw.ai_narrative || fallback.aiNarrative).slice(0, 300),
        redFlagDetails: (raw.red_flag_details || []).map((d: any) => ({
          flagId: d.flag_id || 'flag',
          label: d.label || 'Dấu Hiệu',
          explanation: d.explanation || '',
          learnMore: d.learn_more || '',
        })),
        whatToDo: Array.isArray(raw.what_to_do) && raw.what_to_do.length === 3 ? raw.what_to_do : fallback.whatToDo,
        educationalTip: (raw.educational_tip || fallback.educationalTip).slice(0, 120),
        immunityPointsEarned: [5, 10, 15].includes(raw.immunity_points_earned) ? raw.immunity_points_earned : 5,
      }
    } catch {
      return fallback
    }
  }
}

export const reasoningAgent = new ReasoningAgent()
