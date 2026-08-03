import type { ThreatResult, RedFlag } from '@iis/core'
import { geminiService } from '../services/gemini.service.js'
import { modelConfig } from '../config/gemini.config.js'

const detectResponseSchema = {
  type: 'OBJECT',
  required: ['risk_score', 'classification', 'confidence', 'red_flags', 'action_recommendation', 'gemini_explanation'],
  properties: {
    risk_score: { type: 'NUMBER', minimum: 0, maximum: 100 },
    classification: { type: 'STRING', enum: ['safe', 'suspicious', 'phishing', 'malware', 'scam'] },
    confidence: { type: 'NUMBER', minimum: 0.0, maximum: 1.0 },
    red_flags: {
      type: 'ARRAY',
      maxItems: 10,
      items: {
        type: 'OBJECT',
        required: ['id', 'label', 'severity', 'description'],
        properties: {
          id: { type: 'STRING' },
          label: { type: 'STRING' },
          severity: { type: 'STRING', enum: ['low', 'medium', 'high', 'critical'] },
          description: { type: 'STRING', maxLength: 150 },
        },
      },
    },
    action_recommendation: { type: 'STRING', enum: ['ALLOW', 'BLOCK', 'WARN'] },
    gemini_explanation: { type: 'STRING', maxLength: 200 },
  },
}

export class ThreatDetectionAgent {
  private sanitizeInput(input: string): string {
    return input
      .replace(/\b\d{9,12}\b/g, '[CCCD_REDACTED]')
      .replace(/\b0\d{9}\b/g, '[PHONE_REDACTED]')
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g, '[EMAIL_REDACTED]')
      .replace(/<[^>]+>/g, ' ')
      .slice(0, 4000)
      .trim()
  }

  async execute(contentData: string, contentType: string = 'url', url?: string): Promise<ThreatResult> {
    const sanitized = this.sanitizeInput(contentData)
    const prompt = `
Analyze the following content for fraud/phishing risk targeting Vietnamese internet users.

Content Type: ${contentType}
URL: ${url || 'N/A'}
Sanitized Content:
---
${sanitized}
---

Look for: urgency cues, fake login forms, domain spoofing, unrealistic promises, manipulation tactics.
Respond ONLY with valid JSON matching the schema.
    `.trim()

    const fallback: ThreatResult = {
      riskScore: 50,
      classification: 'suspicious',
      confidence: 0.3,
      redFlags: [],
      actionRecommendation: 'WARN',
      geminiExplanation: 'Không thể phân tích nội dung lúc này. Hãy thận trọng với nội dung này.',
      detectionSource: 'fallback',
      fallback: true,
    }

    try {
      const raw = await geminiService.generateContent<any>(prompt, {
        model: modelConfig.flash,
        temperature: 0.1,
        responseSchema: detectResponseSchema,
        fallbackObject: {
          risk_score: 50,
          classification: 'suspicious',
          confidence: 0.3,
          red_flags: [],
          action_recommendation: 'WARN',
          gemini_explanation: 'Không thể phân tích nội dung lúc này. Hãy thận trọng.',
        },
      })

      return this.applyConfidenceGuardrails(raw)
    } catch {
      return fallback
    }
  }

  private applyConfidenceGuardrails(raw: any): ThreatResult {
    let riskScore = raw.risk_score ?? 50
    let classification = raw.classification ?? 'suspicious'
    let confidence = raw.confidence ?? 0.5
    let actionRecommendation = raw.action_recommendation ?? 'WARN'

    const redFlags: RedFlag[] = (raw.red_flags || []).map((f: any) => ({
      id: f.id || 'red_flag',
      label: f.label || 'Dấu Hiệu Đáng Ngờ',
      severity: f.severity || 'medium',
      description: f.description || '',
    }))

    if (classification === 'safe' && (confidence < 0.85 || redFlags.length > 0)) {
      classification = 'suspicious'
      riskScore = Math.max(riskScore, 35)
    }

    if (riskScore >= 70) actionRecommendation = 'BLOCK'
    else if (riskScore >= 35) actionRecommendation = 'WARN'
    else actionRecommendation = 'ALLOW'

    return {
      riskScore,
      classification,
      confidence,
      redFlags,
      actionRecommendation,
      geminiExplanation: (raw.gemini_explanation || '').slice(0, 200),
      detectionSource: 'ai',
    }
  }
}

export const threatDetectionAgent = new ThreatDetectionAgent()
