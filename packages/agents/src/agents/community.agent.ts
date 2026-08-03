import { geminiService } from '../services/gemini.service.js'
import { modelConfig } from '../config/gemini.config.js'

export interface CommunityReportAnalysis {
  isSpam: boolean
  confidence: number
  domain: string | null
  threatCategory: string
  summary: string
}

const communityReportSchema = {
  type: 'OBJECT',
  required: ['is_spam', 'confidence', 'domain', 'threat_category', 'summary'],
  properties: {
    is_spam: { type: 'BOOLEAN' },
    confidence: { type: 'NUMBER', minimum: 0.0, maximum: 1.0 },
    domain: { type: 'STRING', nullable: true },
    threat_category: { type: 'STRING' },
    summary: { type: 'STRING', maxLength: 150 },
  },
}

export class CommunityAgent {
  async analyzeReport(rawText: string, reportedUrl?: string): Promise<CommunityReportAnalysis> {
    const prompt = `
Analyze this community fraud report submitted by a user in Vietnam.

Reported URL: ${reportedUrl || 'N/A'}
Report Text:
---
${rawText}
---

Determine:
1. Is this spam / invalid report?
2. Confidence score (0.0 to 1.0)
3. Extracted domain (or null)
4. Threat category (Phishing, Scam, Malware, Impersonation)
5. 1-sentence summary in Vietnamese

Respond ONLY with valid JSON matching the schema.
    `.trim()

    const fallback: CommunityReportAnalysis = {
      isSpam: false,
      confidence: 0.8,
      domain: reportedUrl ? new URL(reportedUrl).hostname : null,
      threatCategory: 'Scam',
      summary: 'Báo cáo nghi vấn lừa đảo từ người dùng cộng đồng.',
    }

    try {
      const raw = await geminiService.generateContent<any>(prompt, {
        model: modelConfig.flash,
        temperature: 0.1,
        responseSchema: communityReportSchema,
        fallbackObject: {
          is_spam: false,
          confidence: 0.8,
          domain: fallback.domain,
          threat_category: 'Scam',
          summary: fallback.summary,
        },
      })

      return {
        isSpam: Boolean(raw.is_spam),
        confidence: raw.confidence ?? 0.8,
        domain: raw.domain || fallback.domain,
        threatCategory: raw.threat_category || 'Scam',
        summary: (raw.summary || fallback.summary).slice(0, 150),
      }
    } catch {
      return fallback
    }
  }
}

export const communityAgent = new CommunityAgent()
